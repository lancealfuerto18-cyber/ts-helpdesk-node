require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

async function readSheet() {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
        credentials,
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
        range: "'Form Responses 1'!A:Z"
    });

    return response.data.values;
}

app.get("/", async (req, res) => {
    try {
        const data = await readSheet();
        res.json({
            status: "Helpdesk running 😭🔥",
            data
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});