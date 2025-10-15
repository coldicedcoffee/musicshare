# Quick Start Guide

## Running Without Google Sheets (Easiest)

If you just want to test the app quickly without persistence:

```bash
cd backend
node server.js
```

Then open `frontend/index.html` in your browser.

⚠️ **Note**: Songs will be lost when server restarts.

---

## Running With Google Sheets (Recommended)

For data persistence across server restarts:

### 1. Complete Google Sheets Setup

Follow the detailed guide: [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

You'll need:
- A Google Cloud project
- Google Sheets API enabled  
- Service account credentials (credentials.json)
- A Google Sheet shared with your service account
- Sheet ID in your .env file

### 2. Test Your Setup

```bash
cd backend
node test-sheets.js
```

This will verify everything is configured correctly.

### 3. Start the Server

```bash
node server.js
```

You should see:
```
✅ Google Sheets connected successfully!
📊 Spreadsheet ID: your_sheet_id
🚀 Server running on port 3000
```

---

## What You'll See

### Without Google Sheets:
```
⚠️  Google Sheets integration disabled: credentials.json not found
📝 Running in memory-only mode
🚀 Server running on port 3000
📊 Google Sheets: DISABLED ⚠️
```

### With Google Sheets:
```
✅ Google Sheets connected successfully!
📊 Spreadsheet ID: 1a2b3c4d5e...
📋 Loaded 0 songs from Google Sheets
🚀 Server running on port 3000
📊 Google Sheets: ENABLED ✅
🔗 View spreadsheet: https://docs.google.com/spreadsheets/d/1a2b3c4d5e...
```

---

## Using the App

1. Open `frontend/index.html` in multiple browser windows
2. Enter different usernames in each window
3. Add songs - they'll appear in real-time on all screens
4. If Google Sheets is enabled, songs persist even after server restart!

---

## Troubleshooting

### "Cannot find module 'googleapis'"
```bash
cd backend
npm install
```

### "credentials.json not found"
- The app will work in memory-only mode
- See SETUP_GOOGLE_SHEETS.md to enable persistence

### Port 3000 already in use
Change the PORT in `.env` file:
```
PORT=3001
```

---

## File Checklist

Your `backend` folder should have:
- ✅ `server.js`
- ✅ `googleSheets.js`  
- ✅ `package.json`
- ✅ `.env` (you create this)
- ⚠️ `credentials.json` (optional, for Google Sheets)

---

Need help? Check the main [README.md](README.md) or [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)
