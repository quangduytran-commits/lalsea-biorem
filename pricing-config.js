/**
 * PRICING CONFIG — Sửa giá và combo tại đây, trang tự cập nhật.
 * Giá đơn vị: VND (không có dấu chấm, JS sẽ format tự động).
 */

const PRICING = {
  biorem: {
    name: "LALSEA BIOREM",
    spec: "250g x 20 gói / thùng",
    price: 8200000,
    bonus: "Tặng 4 gói",
    note: "Mua 1–4 thùng",
  },
  immune: {
    name: "LALPACK IMMUNE",
    spec: "500g x 10 gói / thùng",
    price: 3710000,
    bonus: "Tặng 2 gói",
    note: "Mua 1–9 thùng",
  },
  probio: {
    name: "LALPACK PROBIO",
    spec: "500g x 10 gói / thùng",
    price: 3860000,
    bonus: "Tặng 2 gói",
    note: "Mua 1–9 thùng",
  },
  combo: {
    label: "Combo dùng thử",
    title: "Combo giá dùng thử — chỉ cho đơn đầu tiên",
    price: 1553000,
    items: [
      { qty: 2, name: "LALSEA BIOREM" },
      { qty: 1, name: "LALPACK IMMUNE" },
      { qty: 1, name: "LALPACK PROBIO" },
    ],
    condition: "Chỉ áp dụng cho đơn đặt hàng lần đầu tiên.",
    cta: "Đặt combo dùng thử",
    ctaHref: "#form",
  },
};
