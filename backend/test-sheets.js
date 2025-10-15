// Quick test to verify Google Sheets setup
require('dotenv').config();
const googleSheets = require('./googleSheets');

async function testGoogleSheets() {
  console.log('\n🔍 Testing Google Sheets Connection...\n');
  
  console.log('Environment Variables:');
  console.log(`  PORT: ${process.env.PORT || '3000'}`);
  console.log(`  GOOGLE_SHEET_ID: ${process.env.GOOGLE_SHEET_ID || 'NOT SET'}\n`);
  
  const isInitialized = await googleSheets.initialize();
  
  if (isInitialized) {
    console.log('\n✅ SUCCESS! Google Sheets is properly configured!');
    console.log(`🔗 View your spreadsheet: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}\n`);
    
    // Try to get current songs
    const songs = await googleSheets.getAllSongs();
    console.log(`📋 Current playlist has ${songs.length} song(s)\n`);
    
  } else {
    console.log('\n⚠️  Google Sheets is NOT configured.');
    console.log('📝 The app will run in memory-only mode.');
    console.log('📖 See SETUP_GOOGLE_SHEETS.md for setup instructions.\n');
  }
  
  process.exit(0);
}

testGoogleSheets().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
