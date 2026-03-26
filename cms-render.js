/**
 * CMS RENDER — Lấy nội dung từ Google Sheet và cập nhật trang tự động.
 *
 * Cách hoạt động:
 * 1. Trang tải → gọi API Google Sheet
 * 2. Nhận JSON chứa tất cả nội dung
 * 3. Tìm element có data-cms="key" → thay nội dung bằng value từ Sheet
 * 4. Cập nhật giá từ sheet "pricing" và "combo"
 *
 * Nếu Sheet không phản hồi → trang hiển thị nội dung mặc định trong HTML (không bị trắng).
 */

(function () {
  var config = window.CMS_CONFIG || {};
  if (!config.enabled || !config.sheetApiUrl) return;

  var CACHE_KEY = "lalsea_cms_data";
  var CACHE_TIME_KEY = "lalsea_cms_time";

  function fmt(n) {
    return Number(n).toLocaleString("vi-VN");
  }

  // ── Check cache ──
  function getCached() {
    try {
      var time = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);
      if (Date.now() - time < (config.cacheDuration || 300000)) {
        var data = localStorage.getItem(CACHE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {}
    return null;
  }

  function setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch (e) {}
  }

  // ── Apply content ──
  function applyContent(content) {
    if (!content) return;
    document.querySelectorAll("[data-cms]").forEach(function (el) {
      var key = el.getAttribute("data-cms");
      if (content[key] !== undefined && content[key] !== "") {
        // Support HTML content (for <br>, <em>, etc.)
        if (content[key].indexOf("<") !== -1) {
          el.innerHTML = content[key];
        } else {
          el.textContent = content[key];
        }
      }
    });
  }

  // ── Apply pricing ──
  function applyPricing(pricing) {
    if (!pricing) return;

    // Product cards in pricing grid
    document.querySelectorAll("[data-price-product]").forEach(function (card) {
      var key = card.getAttribute("data-price-product");
      var p = pricing[key];
      if (!p) return;

      var el;
      el = card.querySelector("[data-price-name]");
      if (el) el.textContent = p.name;

      el = card.querySelector("[data-price-spec]");
      if (el) el.textContent = p.spec;

      el = card.querySelector("[data-price-value]");
      if (el) el.innerHTML = fmt(p.price) + " <small>đ / thùng</small>";

      el = card.querySelector("[data-price-bonus]");
      if (el) el.textContent = p.bonus;

      el = card.querySelector("[data-price-note]");
      if (el) el.textContent = p.note;
    });

    // LALPACK detail cards
    document.querySelectorAll("[data-lalpack-price]").forEach(function (el) {
      var key = el.getAttribute("data-lalpack-price");
      var p = pricing[key];
      if (!p) return;

      var specEl = el.querySelector("[data-price-spec]");
      if (specEl) specEl.textContent = p.spec;

      var valEl = el.querySelector("[data-price-value]");
      if (valEl) valEl.textContent = fmt(p.price) + " đ";
    });
  }

  // ── Apply combo ──
  function applyCombo(combo) {
    if (!combo) return;
    var comboEl = document.querySelector("[data-price-combo]");
    if (!comboEl) return;

    var el;
    el = comboEl.querySelector("[data-combo-badge]");
    if (el && combo.label) el.textContent = combo.label;

    el = comboEl.querySelector("[data-combo-title]");
    if (el && combo.title) el.textContent = combo.title;

    el = comboEl.querySelector("[data-combo-price]");
    if (el && combo.price) el.innerHTML = fmt(combo.price) + " <small>đ</small>";

    el = comboEl.querySelector("[data-combo-condition]");
    if (el && combo.condition) el.textContent = combo.condition;

    el = comboEl.querySelector("[data-combo-cta]");
    if (el && combo.cta) {
      el.textContent = combo.cta;
      if (combo.ctaHref) el.href = combo.ctaHref;
    }

    var listEl = comboEl.querySelector("[data-combo-items]");
    if (listEl && combo.items && Array.isArray(combo.items)) {
      listEl.innerHTML = combo.items
        .map(function (item) {
          return "<li><strong>" + item.qty + " gói</strong> " + item.name + "</li>";
        })
        .join("");
    }
  }

  // ── Apply phone ──
  function applyPhone(content) {
    if (!content || !content.phone) return;
    document.querySelectorAll("[data-cms-phone]").forEach(function (el) {
      var phone = content.phone.replace(/\s/g, "");
      var display = content.phone_display || content.phone;
      if (el.tagName === "A") {
        el.href = "tel:" + phone;
        el.innerHTML = "&#x1F4DE; " + display;
      } else {
        el.textContent = display;
      }
    });
  }

  // ── Main fetch ──
  function render(data) {
    if (data.content) {
      applyContent(data.content);
      applyPhone(data.content);
    }
    if (data.pricing) applyPricing(data.pricing);
    if (data.combo) applyCombo(data.combo);
  }

  // Try cache first
  var cached = getCached();
  if (cached) {
    render(cached);
  }

  // Always fetch fresh in background
  fetch(config.sheetApiUrl, { redirect: "follow" })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && !data.error) {
        setCache(data);
        render(data);
        console.log("[CMS] Loaded " + Object.keys(data.content || {}).length + " content keys from Sheet");
      }
    })
    .catch(function (err) {
      console.warn("[CMS] Fetch failed, using HTML defaults:", err.message || err);
    });
})();
