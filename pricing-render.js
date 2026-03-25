/**
 * Reads PRICING config and injects values into elements with data-price-* attributes.
 * No need to touch this file — only edit pricing-config.js.
 */

(function () {
  if (typeof PRICING === "undefined") return;

  function fmt(n) {
    return n.toLocaleString("vi-VN");
  }

  // ── Product cards (pricing grid) ──
  document.querySelectorAll("[data-price-product]").forEach(function (card) {
    var key = card.getAttribute("data-price-product");
    var p = PRICING[key];
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

  // ── LALPACK detail cards ──
  document.querySelectorAll("[data-lalpack-price]").forEach(function (el) {
    var key = el.getAttribute("data-lalpack-price");
    var p = PRICING[key];
    if (!p) return;

    var specEl = el.querySelector("[data-price-spec]");
    if (specEl) specEl.textContent = p.spec;

    var valEl = el.querySelector("[data-price-value]");
    if (valEl) valEl.textContent = fmt(p.price) + " đ";
  });

  // ── Combo trial ──
  var comboEl = document.querySelector("[data-price-combo]");
  if (comboEl && PRICING.combo) {
    var c = PRICING.combo;

    var el;
    el = comboEl.querySelector("[data-combo-badge]");
    if (el) el.textContent = c.label;

    el = comboEl.querySelector("[data-combo-title]");
    if (el) el.textContent = c.title;

    el = comboEl.querySelector("[data-combo-price]");
    if (el) el.innerHTML = fmt(c.price) + " <small>đ</small>";

    el = comboEl.querySelector("[data-combo-condition]");
    if (el) el.textContent = c.condition;

    el = comboEl.querySelector("[data-combo-cta]");
    if (el) {
      el.textContent = c.cta;
      el.href = c.ctaHref || "#form";
    }

    var listEl = comboEl.querySelector("[data-combo-items]");
    if (listEl) {
      listEl.innerHTML = c.items
        .map(function (item) {
          return "<li><strong>" + item.qty + " gói</strong> " + item.name + "</li>";
        })
        .join("");
    }
  }
})();
