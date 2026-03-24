# Lead Delivery Setup

Trang standalone nay duoc thiet ke theo flow:

1. Landing page submit JSON sang Google Apps Script Web App.
2. Google Apps Script ghi lead vao Google Sheet.
3. Google Apps Script gui thong bao qua Telegram bot.

## 1. Tao Google Sheet

- Tao mot Google Sheet moi de nhan lead.
- Copy `Spreadsheet ID` trong URL cua Sheet.

Vi du:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
```

## 2. Tao Google Apps Script

- Mo `Extensions > Apps Script` tu Google Sheet.
- Tao file `Code.gs` moi.
- Copy noi dung tu [google-apps-script/Code.gs](/Users/duytran/thanvuong-nextjs-site/standalone/lalsea-biorem/google-apps-script/Code.gs) vao.

## 3. Set script properties

Trong Apps Script:

- Vao `Project Settings`
- Tim `Script Properties`
- Tao cac key sau:

```text
SHEET_ID=your_google_sheet_id
SHEET_NAME=Leads
TELEGRAM_BOT_TOKEN=123456:ABCDEF...
TELEGRAM_CHAT_ID=-1001234567890
```

`SHEET_ID` la cach on dinh hon cho web app. Neu ban khong dien `SHEET_ID`, script se thu dung Google Sheet dang gan voi Apps Script.

`TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` la tuy chon, nhung neu de trong thi lead chi do vao Sheet ma khong bao Telegram.

## 4. Deploy Web App

- Chon `Deploy > New deployment`
- Chon loai `Web app`
- `Execute as`: `Me`
- `Who has access`: `Anyone`
- Deploy va copy `Web app URL`

## 5. Noi endpoint vao landing

Cap nhat file [lead-config.js](/Users/duytran/thanvuong-nextjs-site/standalone/lalsea-biorem/lead-config.js):

```js
window.LALSEA_LEAD_CONFIG = {
  endpointUrl: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec",
  successMessage: "Da gui thong tin thanh cong. Doi ky thuat se lien he voi ban trong it phut.",
  errorMessage: "Gui that bai. Vui long thu lai hoac lien he truc tiep.",
};
```

## 6. Kiem tra submit

- Chay standalone local
- Dien form
- Kiem tra:
  - Lead da xuat hien trong Google Sheet
  - Telegram bot da gui message vao chat

## Truong du lieu dang gui

Landing dang gui cac truong sau:

```text
name
phone
pondArea
issue
notes
product
landingPage
pageUrl
submittedAt
userAgent
```

## Ghi chu ky thuat

- Form client nam o [lead-submit.js](/Users/duytran/thanvuong-nextjs-site/standalone/lalsea-biorem/lead-submit.js)
- Cau hinh endpoint nam o [lead-config.js](/Users/duytran/thanvuong-nextjs-site/standalone/lalsea-biorem/lead-config.js)
- Google Apps Script Web App can co `doPost(e)` va tra ve `TextOutput` hoac `HtmlOutput` theo tai lieu chinh thuc cua Google Apps Script.
- Endpoint Telegram duoc goi qua `sendMessage` cua Telegram Bot API.
