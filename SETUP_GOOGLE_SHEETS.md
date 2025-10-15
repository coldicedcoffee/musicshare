# Setting Up Google Sheets Integration

This guide will help you set up Google Sheets to store your playlist data.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "MusicShare" and click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - **Service account name**: musicshare-service
   - **Service account ID**: (auto-generated)
   - Click "Create and Continue"
4. Skip the optional steps and click "Done"

## Step 4: Generate JSON Key

1. In the "Credentials" page, find your service account in the list
2. Click on it to open details
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. A JSON file will download - **this is your credentials.json file**

## Step 5: Set Up Credentials File

1. Rename the downloaded file to `credentials.json`
2. Move it to the `backend` folder of your MusicShare project:
   ```
   MusicShare/backend/credentials.json
   ```

## Step 6: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "MusicShare Playlist"
4. Copy the **spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```

## Step 7: Share the Sheet with Service Account

1. In your Google Sheet, click the "Share" button
2. Paste the service account email (found in credentials.json, looks like: `musicshare-service@project-id.iam.gserviceaccount.com`)
3. Give it "Editor" access
4. Uncheck "Notify people"
5. Click "Share"

## Step 8: Configure Environment Variables

1. Open the `.env` file in the `backend` folder
2. Add your spreadsheet ID:
   ```
   PORT=3000
   GOOGLE_SHEET_ID=your_spreadsheet_id_here
   ```

## Step 9: Install Dependencies and Restart

```bash
cd backend
npm install
node server.js
```

## Expected Output

When successfully connected, you should see:

```
🚀 Server running on port 3000
📡 REST API available at http://localhost:3000/api
📊 Google Sheets: ENABLED ✅
🔗 View spreadsheet: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID
```

## Troubleshooting

### "credentials.json not found"
- Make sure `credentials.json` is in the `backend` folder
- Check the file name is exactly `credentials.json` (case-sensitive)

### "Permission denied"
- Make sure you shared the spreadsheet with the service account email
- The service account email is in your `credentials.json` file under `client_email`

### "Spreadsheet not found"
- Verify the `GOOGLE_SHEET_ID` in `.env` is correct
- Make sure you copied only the ID, not the full URL

### Still having issues?
The app will work in **memory-only mode** if Google Sheets setup fails. Your data will be stored in memory but won't persist between server restarts.

## File Structure

After setup, your backend folder should look like:

```
backend/
├── server.js
├── googleSheets.js
├── package.json
├── credentials.json    ← Your service account credentials
├── .env               ← Your environment variables
└── node_modules/
```

## Security Notes

⚠️ **IMPORTANT**: 
- Add `credentials.json` and `.env` to `.gitignore` 
- Never commit these files to version control
- Never share your credentials publicly
- The `.gitignore` file is already configured for you

## What Gets Stored in Google Sheets?

The spreadsheet will have the following columns:
- **ID**: Unique identifier for each song
- **Title**: Song title
- **Artist**: Artist name
- **Album**: Album name (optional)
- **Duration**: Song duration (optional)
- **Added By**: Username who added the song
- **Added At**: Timestamp when song was added

All data will be automatically formatted with a nice header row in blue!
