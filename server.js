require("dotenv").config();

const { google } = require("googleapis");

async function readSheet() {

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const client = await auth.getClient();

    const sheets = google.sheets({
        version: "v4",
        auth: client
    });

    const spreadsheetId = "1lKKZG6jbn-p8yt0KB4DJkgoa3W3pIKDrlfdvSYdTED4";

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:Z"
    });

    console.log("✅ Sheet Data:");
    console.log(response.data.values);
}

readSheet();