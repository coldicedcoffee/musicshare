# MusicShare - Collaborative Playlist Application

A real-time collaborative playlist application where multiple users can add, remove, and share songs together.

🌐 **Deploy your own:** Follow [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) to host this online for FREE!

## Features

- 🎵 **Real-time Updates**: Changes reflect instantly across all connected users
- 👥 **Multiple Users**: Support for unlimited concurrent users
- ➕ **Add Songs**: Any user can add songs with title, artist, album, and duration
- 🗑️ **Remove Songs**: Delete individual songs from the playlist
- 🔄 **Live User List**: See who's online in real-time
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Frontend
- **HTML5/CSS3** - UI structure and styling
- **JavaScript** - Client-side logic
- **Socket.IO Client** - Real-time updates

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/musicshare.git
cd musicshare
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

### Deploy to Production

See **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** for step-by-step deployment guide.

Quick options:
- **Backend:** [Render](https://render.com) (FREE)
- **Frontend:** [Netlify](https://netlify.com) (FREE)

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Open the Frontend

Simply open the `frontend/index.html` file in multiple browser windows to simulate multiple users.

## API Documentation

### REST Endpoints

#### Get Playlist
```
GET /api/playlist
```
Returns the complete playlist with all songs.

**Response:**
```json
{
  "success": true,
  "playlist": [...],
  "totalSongs": 5
}
```

#### Add Song
```
POST /api/playlist
Content-Type: application/json

{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name (optional)",
  "duration": "3:45 (optional)",
  "addedBy": "Username"
}
```

#### Remove Song
```
DELETE /api/playlist/:id
```
Removes a song by its ID.

#### Clear Playlist
```
DELETE /api/playlist
```
Removes all songs from the playlist.

#### Get Users
```
GET /api/users
```
Returns all currently connected users.

### Socket.IO Events

#### Client → Server

- `userJoin(username)` - User joins the session
- `addSong(songData)` - Add a new song
- `removeSong(songId)` - Remove a song

#### Server → Client

- `initialPlaylist(playlist)` - Sent when user connects
- `playlistUpdated(data)` - Sent when playlist changes
- `userListUpdated(data)` - Sent when users join/leave

## Usage

1. Open the application in your browser
2. Enter your name and click "Join Session"
3. Add songs using the form (title and artist are required)
4. Watch as songs appear in real-time for all users
5. Remove songs by clicking the "Remove" button
6. Clear the entire playlist with "Clear All"

## Testing with Multiple Users

1. Start the backend server
2. Open `frontend/index.html` in multiple browser windows
3. Join with different usernames in each window
4. Add/remove songs in any window and watch them sync across all windows

## Project Structure

```
MusicShare/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies and scripts
│   └── node_modules/      # Installed packages
├── frontend/
│   └── index.html         # Client application
└── README.md              # This file
```

## Future Enhancements

- 🗄️ Database integration (MongoDB/PostgreSQL)
- 🔐 User authentication
- 🎨 Custom playlists per user
- ▶️ Embedded music player
- 🔍 Search and filter songs
- 💾 Playlist persistence
- 📊 Song voting/rating system
- 🎧 Spotify/YouTube API integration

## License

ISC

## Author

Your Name
