/**
 * GOOGLE APPS SCRIPT — Đặt trong Google Sheet để tạo API JSON
 *
 * CÁCH CÀI ĐẶT:
 * 1. Mở Google Sheet
 * 2. Vào Extensions > Apps Script
 * 3. Dán toàn bộ code này vào
 * 4. Bấm Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL Web App → dán vào file cms-config.js trên landing page
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {};

    // Sheet "content" — key/value pairs
    var contentSheet = ss.getSheetByName("content");
    if (contentSheet) {
      var contentData = contentSheet.getDataRange().getValues();
      var content = {};
      for (var i = 1; i < contentData.length; i++) { // skip header row
        var key = String(contentData[i][0]).trim();
        var value = String(contentData[i][1]).trim();
        if (key && key !== "key") {
          content[key] = value;
        }
      }
      result.content = content;
    }

    // Sheet "pricing" — product pricing
    var pricingSheet = ss.getSheetByName("pricing");
    if (pricingSheet) {
      var pricingData = pricingSheet.getDataRange().getValues();
      var pricing = {};
      for (var i = 1; i < pricingData.length; i++) {
        var key = String(pricingData[i][0]).trim();
        if (key && key !== "key") {
          pricing[key] = {
            name: String(pricingData[i][1]).trim(),
            spec: String(pricingData[i][2]).trim(),
            price: Number(pricingData[i][3]),
            bonus: String(pricingData[i][4]).trim(),
            note: String(pricingData[i][5]).trim()
          };
        }
      }
      result.pricing = pricing;
    }

    // Sheet "combo" — combo deal
    var comboSheet = ss.getSheetByName("combo");
    if (comboSheet) {
      var comboData = comboSheet.getDataRange().getValues();
      var combo = {};
      for (var i = 1; i < comboData.length; i++) {
        var key = String(comboData[i][0]).trim();
        var value = String(comboData[i][1]).trim();
        if (key) {
          combo[key] = value;
        }
      }
      // Parse items
      if (combo.items) {
        try {
          combo.items = JSON.parse(combo.items);
        } catch(e) {
          combo.items = [];
        }
      }
      if (combo.price) {
        combo.price = Number(combo.price);
      }
      result.combo = combo;
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
