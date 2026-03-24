function doGet() {
  return jsonResponse({
    ok: true,
    message: "LALSEA lead receiver is running.",
  });
}

function doPost(e) {
  try {
    var payload = parsePayload_(e);
    validatePayload_(payload);

    var scriptProperties = PropertiesService.getScriptProperties();
    var sheetId = scriptProperties.getProperty("SHEET_ID");
    var sheetName = scriptProperties.getProperty("SHEET_NAME") || "Leads";
    var telegramBotToken = scriptProperties.getProperty("TELEGRAM_BOT_TOKEN");
    var telegramChatId = scriptProperties.getProperty("TELEGRAM_CHAT_ID");

    var spreadsheet = sheetId
      ? SpreadsheetApp.openById(sheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error(
        "Cannot find target spreadsheet. Set SHEET_ID in Script Properties or create this Apps Script from the target Google Sheet."
      );
    }
    var sheet = getOrCreateSheet_(spreadsheet, sheetName);

    ensureHeader_(sheet);

    var receivedAt =
      payload.submittedAt ||
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    sheet.appendRow([
      receivedAt,
      payload.product || "",
      payload.name || "",
      payload.phone || "",
      payload.pondArea || "",
      payload.issue || "",
      payload.notes || "",
      payload.landingPage || "",
      payload.pageUrl || "",
      payload.userAgent || "",
    ]);

    if (telegramBotToken && telegramChatId) {
      sendTelegramMessage_(telegramBotToken, telegramChatId, payload, receivedAt);
    }

    return jsonResponse({
      ok: true,
      message: "Lead saved successfully.",
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message || "Unknown error.",
    });
  }
}

function parsePayload_(e) {
  if (!e) return {};

  var body = e.postData && e.postData.contents ? e.postData.contents : "";
  if (body) {
    return JSON.parse(body);
  }

  return e.parameter || {};
}

function validatePayload_(payload) {
  if (!payload.name) {
    throw new Error("Missing required field: name");
  }

  if (!payload.phone) {
    throw new Error("Missing required field: phone");
  }

  if (!payload.issue) {
    throw new Error("Missing required field: issue");
  }
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet) return sheet;
  return spreadsheet.insertSheet(sheetName);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    "submitted_at",
    "product",
    "name",
    "phone",
    "pond_area",
    "issue",
    "notes",
    "landing_page",
    "page_url",
    "user_agent",
  ]);
}

function sendTelegramMessage_(botToken, chatId, payload, receivedAt) {
  var lines = [
    "Lead moi tu landing LALSEA BIOREM",
    "",
    "Thoi gian: " + receivedAt,
    "Khach hang: " + (payload.name || "-"),
    "Dien thoai: " + (payload.phone || "-"),
    "Dien tich ao: " + (payload.pondArea || "-"),
    "Tinh trang: " + (payload.issue || "-"),
    "Mo ta them: " + (payload.notes || "-"),
    "Landing: " + (payload.landingPage || "-"),
    "URL: " + (payload.pageUrl || "-"),
  ];

  var response = UrlFetchApp.fetch(
    "https://api.telegram.org/bot" + botToken + "/sendMessage",
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
      }),
      muteHttpExceptions: true,
    }
  );

  var statusCode = response.getResponseCode();
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error("Telegram notification failed with status " + statusCode);
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
