const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.sheetName = 'Playlist';
  }

  async initialize() {
    try {
      // Check if credentials file exists
      const credentialsPath = path.join(__dirname, 'credentials.json');
      
      try {
        await fs.access(credentialsPath);
      } catch (error) {
        console.log('⚠️  Google Sheets integration disabled: credentials.json not found');
        console.log('📝 To enable Google Sheets:');
        console.log('   1. Go to https://console.cloud.google.com/');
        console.log('   2. Create a service account and download credentials.json');
        console.log('   3. Place credentials.json in the backend folder');
        console.log('   4. Set GOOGLE_SHEET_ID in .env file');
        return false;
      }

      const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      // Initialize spreadsheet if needed
      if (this.spreadsheetId) {
        await this.initializeSheet();
        console.log('✅ Google Sheets connected successfully!');
        console.log(`📊 Spreadsheet ID: ${this.spreadsheetId}`);
        return true;
      } else {
        console.log('⚠️  GOOGLE_SHEET_ID not set in .env file');
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing Google Sheets:', error.message);
      return false;
    }
  }

  async initializeSheet() {
    try {
      // Check if sheet exists
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheetExists = response.data.sheets.some(
        sheet => sheet.properties.title === this.sheetName
      );

      if (!sheetExists) {
        // Create the sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: this.sheetName,
                },
              },
            }],
          },
        });
      }

      // Set up headers
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A1:G1`,
        valueInputOption: 'RAW',
        resource: {
          values: [['ID', 'Title', 'Artist', 'Album', 'Duration', 'Added By', 'Added At']],
        },
      });

      // Format header row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            repeatCell: {
              range: {
                sheetId: await this.getSheetId(),
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.4, green: 0.5, blue: 0.9 },
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          }],
        },
      });

    } catch (error) {
      console.error('Error initializing sheet:', error.message);
    }
  }

  async getSheetId() {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = response.data.sheets.find(
      s => s.properties.title === this.sheetName
    );

    return sheet ? sheet.properties.sheetId : 0;
  }

  async getAllSongs() {
    if (!this.sheets || !this.spreadsheetId) return [];

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A2:G`,
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        id: row[0] || '',
        title: row[1] || '',
        artist: row[2] || '',
        album: row[3] || '',
        duration: row[4] || '',
        addedBy: row[5] || '',
        addedAt: row[6] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error reading from Google Sheets:', error.message);
      return [];
    }
  }

  async addSong(song) {
    if (!this.sheets || !this.spreadsheetId) return false;

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:G`,
        valueInputOption: 'RAW',
        resource: {
          values: [[
            song.id,
            song.title,
            song.artist,
            song.album || '',
            song.duration || '',
            song.addedBy,
            song.addedAt,
          ]],
        },
      });

      console.log(`📝 Song "${song.title}" added to Google Sheets`);
      return true;
    } catch (error) {
      console.error('Error adding song to Google Sheets:', error.message);
      return false;
    }
  }

  async removeSong(songId) {
    if (!this.sheets || !this.spreadsheetId) return false;

    try {
      // Get all rows
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:G`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === songId);

      if (rowIndex === -1) return false;

      // Delete the row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId(),
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        },
      });

      console.log(`🗑️  Song with ID ${songId} removed from Google Sheets`);
      return true;
    } catch (error) {
      console.error('Error removing song from Google Sheets:', error.message);
      return false;
    }
  }

  async clearAllSongs() {
    if (!this.sheets || !this.spreadsheetId) return false;

    try {
      // Clear all data except header
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A2:G`,
      });

      console.log('🧹 All songs cleared from Google Sheets');
      return true;
    } catch (error) {
      console.error('Error clearing Google Sheets:', error.message);
      return false;
    }
  }

  isEnabled() {
    return this.sheets !== null && this.spreadsheetId !== null;
  }
}

module.exports = new GoogleSheetsService();
