# Hướng dẫn dùng Google Sheet làm trang Admin

## Tổng quan

```
Google Sheet (bạn sửa ở đây)
    ↓
Apps Script (API tự động)
    ↓
Landing Page (tự cập nhật)
```

## Bước 1: Tạo Google Sheet

1. Vào https://sheets.google.com → tạo sheet mới
2. Đặt tên: **"LALSEA BIOREM - Admin"**
3. Tạo **3 tab** (sheet) với tên chính xác:

### Tab "content" (nội dung trang)

| key | value |
|-----|-------|
| phone | 0867 957 568 |
| phone_display | Liên hệ / Zalo: 0867 957 568 |
| hero_alert | Nước xấu – đáy bẩn – khí độc tăng? |
| hero_eyebrow | Giải pháp vi sinh quản lý nước cho ao tôm |
| hero_title | LALSEA BIOREM |
| hero_lead | Nếu bạn đang đánh vi sinh liên tục mà nước vẫn xấu, bùn vẫn dày và tôm vẫn yếu, vấn đề thường không nằm ở mặt nước mà nằm ở nền đáy và tải hữu cơ chưa được xử lý đúng. |

> Cột A = key (không đổi), Cột B = value (sửa tùy ý)

### Tab "pricing" (bảng giá)

| key | name | spec | price | bonus | note |
|-----|------|------|-------|-------|------|
| biorem | LALSEA BIOREM | 250g x 20 gói / thùng | 8200000 | Tặng 4 gói | Mua 1–4 thùng |
| immune | LALPACK IMMUNE | 500g x 10 gói / thùng | 3710000 | Tặng 2 gói | Mua 1–9 thùng |
| probio | LALPACK PROBIO | 500g x 10 gói / thùng | 3860000 | Tặng 2 gói | Mua 1–9 thùng |

> Đổi giá: sửa cột price. Đổi khuyến mãi: sửa cột bonus.

### Tab "combo" (combo dùng thử)

| key | value |
|-----|-------|
| label | Combo dùng thử |
| title | Combo giá dùng thử — chỉ cho đơn đầu tiên |
| price | 1553000 |
| items | [{"qty":2,"name":"LALSEA BIOREM"},{"qty":1,"name":"LALPACK IMMUNE"},{"qty":1,"name":"LALPACK PROBIO"}] |
| condition | Chỉ áp dụng cho đơn đặt hàng lần đầu tiên. |
| cta | Đặt combo dùng thử |
| ctaHref | #form |

> Đổi giá combo: sửa ô value của dòng price.

## Bước 2: Cài Apps Script (API)

1. Trong Google Sheet, vào **Extensions > Apps Script**
2. Xóa hết code mặc định
3. Dán toàn bộ nội dung từ file `google-apps-script/sheet-api.gs`
4. Bấm **Deploy > New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Bấm **Deploy**
6. **Copy URL** Web App (dạng: `https://script.google.com/macros/s/ABC.../exec`)

## Bước 3: Kết nối với Landing Page

1. Mở file `cms-config.js`
2. Dán URL vào:

```javascript
window.CMS_CONFIG = {
  sheetApiUrl: "https://script.google.com/macros/s/ABC.../exec",  // ← URL của bạn
  enabled: true,
  cacheDuration: 300000,
};
```

3. Commit và push lên GitHub

## Cách sử dụng hàng ngày

### Đổi giá
1. Mở Google Sheet
2. Vào tab **pricing**
3. Sửa số trong cột **price**
4. Trang tự cập nhật trong vòng 5 phút (hoặc reload trang)

### Đổi số điện thoại
1. Vào tab **content**
2. Sửa dòng **phone** và **phone_display**

### Đổi nội dung
1. Vào tab **content**
2. Sửa value của key tương ứng

### Đổi combo
1. Vào tab **combo**
2. Sửa giá, tên, điều kiện

## Lưu ý
- Trang cache nội dung 5 phút. Nếu muốn thấy ngay: mở trang → bấm Ctrl+Shift+R
- Nếu Sheet lỗi hoặc không kết nối được → trang vẫn hiển thị nội dung mặc định (không bị trắng)
- Không đổi tên các key ở cột A — chỉ sửa giá trị ở cột B
