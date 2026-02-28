require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

// Serve static UI files
app.use(express.static("public"));

// Serve homepage UI
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Google Sheets Reader
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

// Optional API endpoint (for future frontend use 😈🔥)
app.get("/tickets", async (req,res)=>{
    try{
        const data = await readSheet();
        res.json(data);
    }catch(err){
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Helpdesk running on port " + PORT);
});