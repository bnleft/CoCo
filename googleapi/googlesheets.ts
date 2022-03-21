const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
        keyFile: "./googleapi/sheetkeys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

export async function runGS() {
        const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1bPJsKQK2kSC5D9mn_LoAInBqg-wQxk6oZuXYHkRUEsA";
    
    const sheetName = "Members";
    const columns = ['A', 'B', 'AL'];

    const getNameRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${sheetName}!${columns[0]}:${columns[0]}`,
    });

    const getDiscordTagRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${sheetName}!${columns[1]}:${columns[1]}`,
    });

    const getPointRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${sheetName}!${columns[2]}:${columns[2]}`,
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

