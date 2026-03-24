(function () {
  const form = document.querySelector("[data-lead-form]");
  if (!form) return;

  const config = window.LALSEA_LEAD_CONFIG || {};
  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector("[data-submit-button]");
  const pageUrlField = form.querySelector("[data-page-url]");
  const defaultButtonText = submitButton ? submitButton.textContent.trim() : "";

  if (pageUrlField) {
    pageUrlField.value = window.location.href;
  }

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message || "";
    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Dang gui..." : defaultButtonText;
  }

  async function submitLead(payload) {
    try {
      const response = await fetch(config.endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          data = { raw: responseText };
        }
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Khong the gui lead luc nay.");
      }

      return data;
    } catch (error) {
      const isNetworkStyleError =
        error instanceof TypeError || /failed to fetch/i.test(String(error && error.message));

      if (!isNetworkStyleError) {
        throw error;
      }

      await fetch(config.endpointUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      return { ok: true, transport: "no-cors-fallback" };
    }
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!config.endpointUrl) {
      setStatus(config.errorMessage, "error");
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.submittedAt = new Date().toISOString();
    payload.userAgent = window.navigator.userAgent;

    setStatus("Dang gui thong tin...", "");
    setSubmitting(true);

    try {
      const result = await submitLead(payload);
      form.reset();
      if (pageUrlField) {
        pageUrlField.value = window.location.href;
      }
      setStatus(
        result && result.transport === "no-cors-fallback"
          ? config.pendingVerificationMessage || config.successMessage
          : config.successMessage,
        "success"
      );
    } catch (error) {
      setStatus(error.message || "Gui that bai. Vui long thu lai.", "error");
    } finally {
      setSubmitting(false);
    }
  });
})();
