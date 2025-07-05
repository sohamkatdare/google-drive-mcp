import express from "express";
import { processQuery } from "./gemini-ex.js";
import cors from 'cors';
import { google } from 'googleapis';
import "dotenv/config";
const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
// Google OAuth2 setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// In-memory token store (replace with DB/session in production)
let userTokens = null;
app.get("/hello", (req, res) => {
    res.send("hello, world");
});
// Route to start OAuth flow
app.get("/auth/google", async (req, res) => {
    console.log('hello');
    const scopes = [
        "https://www.googleapis.com/auth/drive.readonly"
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent"
    });
    res.redirect(url);
});
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).send("Missing code parameter");
        return;
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        userTokens = tokens;
        oauth2Client.setCredentials(tokens);
        res.status(200).send({ success: true, tokens });
        return;
    }
    catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});
app.post('/chat/', async (req, res) => {
    try {
        const queryParam = req.query.query;
        let query;
        if (typeof queryParam === 'string') {
            query = queryParam;
        }
        else if (Array.isArray(queryParam) && typeof queryParam[0] === 'string') {
            query = queryParam[0];
        }
        else {
            res.status(400).json({ logs: 'Error: query parameter is required and must be a string' });
            return;
        }
        const response = await processQuery(query);
        res.json({ 'response': response, 'logs': 'Passed to llm successfully' });
    }
    catch (error) {
        res.status(500).json({ 'logs': 'Error: ' + error });
    }
});
app.listen(port, () => {
    console.log('API listening on port ' + port);
});
