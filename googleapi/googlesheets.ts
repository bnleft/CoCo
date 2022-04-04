import { google } from 'googleapis';
import {
    MemberData,
    MembersData
} from "../interfaces";

type ColumnData = any[][] | any[] | null | undefined;
    

const auth = new google.auth.GoogleAuth({
        keyFile: "./googleapi/sheetkeys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

export async function runGS() {
        const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1bPJsKQK2kSC5D9mn_LoAInBqg-wQxk6oZuXYHkRUEsA";

    const sheetName = "Members";
    const columns = ['A', 'B', 'C'];

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

    const nameData: ColumnData = getNameRows.data.values;
    const tagData: ColumnData = getDiscordTagRows.data.values;
    const pointData: ColumnData = getPointRows.data.values;

    let membersData: MembersData = {};

    if (nameData != undefined && 
        tagData != undefined && 
        pointData != undefined && 
        nameData != null && 
        tagData != null &&
        pointData != null) {


        for(let i = 1; i < nameData.length; i++){
            let tempData: MemberData = {
                name: nameData[i],
                point: pointData[i]
            };

            membersData[tagData[i]] = tempData;
        }
    }
    return membersData;
}

