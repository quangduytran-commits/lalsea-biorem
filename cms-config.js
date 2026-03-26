/**
 * CMS CONFIG — Cấu hình kết nối Google Sheet
 *
 * Sau khi deploy Google Apps Script, dán URL Web App vào đây.
 * Landing page sẽ tự lấy nội dung từ Google Sheet mỗi khi tải trang.
 */

window.CMS_CONFIG = {
  // ← DÁN URL WEB APP CỦA BẠN VÀO ĐÂY
  sheetApiUrl: "https://script.google.com/macros/s/AKfycbzMBUTcVKaNruumiY34ipbtPSOlszRiqj5YWfkBQCvu57HcYQSUxtcJYmpXkv3MV6DW/exec",

  // Bật/tắt CMS (nếu tắt, trang dùng nội dung mặc định trong HTML)
  enabled: true,

  // Cache thời gian (ms) — tránh gọi Sheet quá nhiều lần
  // 5 phút = 300000, 1 phút = 60000
  cacheDuration: 300000,
};
