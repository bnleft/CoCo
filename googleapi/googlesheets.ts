// Google Sheets API | https://developers.google.com/sheets/api/quickstart/nodejs
// Google Developer | https://console.cloud.google.com/
const { google } = require('googleapis');

export async function runGS() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "./googleapi/sheetkeys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1OUhuK8RTGvBdkaTB6G5GT0hvtcB070zMpVPt-ZYgk5Q";

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!D:D",
    });

    console.log(getRows.data.values);
}

