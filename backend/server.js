require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const googleSheets = require('./googleSheets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (synced with Google Sheets)
let playlist = [];
let users = new Map(); // Map of userId -> username
let sheetsEnabled = false;

// Initialize Google Sheets
async function initializeGoogleSheets() {
  sheetsEnabled = await googleSheets.initialize();
  if (sheetsEnabled) {
    // Load existing playlist from Google Sheets
    playlist = await googleSheets.getAllSongs();
    console.log(`📋 Loaded ${playlist.length} songs from Google Sheets`);
  } else {
    console.log('📝 Running in memory-only mode (Google Sheets disabled)');
  }
}

// REST API Endpoints

// Get all songs in playlist
app.get('/api/playlist', async (req, res) => {
  // Refresh from Google Sheets if enabled
  if (sheetsEnabled) {
    playlist = await googleSheets.getAllSongs();
  }
  
  res.json({
    success: true,
    playlist: playlist,
    totalSongs: playlist.length,
    googleSheetsEnabled: sheetsEnabled
  });
});

// Add a song to playlist
app.post('/api/playlist', async (req, res) => {
  const { title, artist, addedBy, userId } = req.body;
  
  if (!title || !artist || !addedBy) {
    return res.status(400).json({
      success: false,
      message: 'Title, artist, and addedBy are required'
    });
  }

  const newSong = {
    id: uuidv4(),
    title,
    artist,
    album: req.body.album || '',
    duration: req.body.duration || '',
    addedBy,
    userId,
    addedAt: new Date().toISOString()
  };

  playlist.push(newSong);

  // Save to Google Sheets if enabled
  if (sheetsEnabled) {
    await googleSheets.addSong(newSong);
  }

  // Broadcast to all connected clients
  io.emit('playlistUpdated', {
    action: 'add',
    song: newSong,
    playlist: playlist
  });

  res.json({
    success: true,
    song: newSong,
    message: 'Song added successfully',
    savedToGoogleSheets: sheetsEnabled
  });
});

// Remove a song from playlist
app.delete('/api/playlist/:id', async (req, res) => {
  const { id } = req.params;
  const songIndex = playlist.findIndex(song => song.id === id);

  if (songIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Song not found'
    });
  }

  const removedSong = playlist.splice(songIndex, 1)[0];

  // Remove from Google Sheets if enabled
  if (sheetsEnabled) {
    await googleSheets.removeSong(id);
  }

  // Broadcast to all connected clients
  io.emit('playlistUpdated', {
    action: 'remove',
    song: removedSong,
    playlist: playlist
  });

  res.json({
    success: true,
    message: 'Song removed successfully',
    song: removedSong
  });
});

// Clear entire playlist
app.delete('/api/playlist', async (req, res) => {
  playlist = [];

  // Clear Google Sheets if enabled
  if (sheetsEnabled) {
    await googleSheets.clearAllSongs();
  }

  // Broadcast to all connected clients
  io.emit('playlistUpdated', {
    action: 'clear',
    playlist: playlist
  });

  res.json({
    success: true,
    message: 'Playlist cleared'
  });
});

// Get all active users
app.get('/api/users', (req, res) => {
  const userList = Array.from(users.entries()).map(([id, username]) => ({
    id,
    username
  }));

  res.json({
    success: true,
    users: userList,
    totalUsers: userList.length
  });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('userJoin', (username) => {
    users.set(socket.id, username);
    
    // Send current playlist to new user
    socket.emit('initialPlaylist', playlist);
    
    // Broadcast updated user list
    io.emit('userListUpdated', {
      users: Array.from(users.entries()).map(([id, name]) => ({
        id,
        username: name
      })),
      totalUsers: users.size
    });

    console.log(`User ${username} joined. Total users: ${users.size}`);
  });

  // Real-time song add
  socket.on('addSong', async (songData) => {
    const newSong = {
      id: uuidv4(),
      title: songData.title,
      artist: songData.artist,
      album: songData.album || '',
      duration: songData.duration || '',
      addedBy: songData.addedBy,
      userId: socket.id,
      addedAt: new Date().toISOString()
    };

    playlist.push(newSong);

    // Save to Google Sheets if enabled
    if (sheetsEnabled) {
      await googleSheets.addSong(newSong);
    }

    // Broadcast to all clients
    io.emit('playlistUpdated', {
      action: 'add',
      song: newSong,
      playlist: playlist
    });
  });

  // Real-time song remove
  socket.on('removeSong', async (songId) => {
    const songIndex = playlist.findIndex(song => song.id === songId);
    
    if (songIndex !== -1) {
      const removedSong = playlist.splice(songIndex, 1)[0];
      
      // Remove from Google Sheets if enabled
      if (sheetsEnabled) {
        await googleSheets.removeSong(songId);
      }
      
      // Broadcast to all clients
      io.emit('playlistUpdated', {
        action: 'remove',
        song: removedSong,
        playlist: playlist
      });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    
    // Broadcast updated user list
    io.emit('userListUpdated', {
      users: Array.from(users.entries()).map(([id, name]) => ({
        id,
        username: name
      })),
      totalUsers: users.size
    });

    console.log(`User ${username} disconnected. Total users: ${users.size}`);
  });
});

const PORT = process.env.PORT || 3000;

// Initialize and start server
initializeGoogleSheets().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 REST API available at http://localhost:${PORT}/api`);
    console.log(`📊 Google Sheets: ${sheetsEnabled ? 'ENABLED ✅' : 'DISABLED ⚠️'}`);
    if (sheetsEnabled && process.env.GOOGLE_SHEET_ID) {
      console.log(`🔗 View spreadsheet: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}\n`);
    }
  });
});
