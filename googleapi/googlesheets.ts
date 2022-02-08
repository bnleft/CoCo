const { google } = require('googleapis');

export async function runGS() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "./googleapi/sheetkeys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1Aun3NhxSLYnAzBL3EOfnxb3kB_8xEvLyvg1ZrBzacOA";


    const getNameRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Points!A:A",
    });

    const getDiscordTagRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Points!B:B",
    });

    const getPointRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Points!P:P",
    });

    const nameData = getNameRows.data.values;
    const tagData = getDiscordTagRows.data.values;
    const pointData = getPointRows.data.values;

    let memberData = [];

    for(let i = 1; i < nameData.length; i++){
        let tempData = {
            name: nameData[i],
            tag: tagData[i],
            point: pointData[i]
        };

        memberData.push(tempData);
    }

    return memberData;
}

