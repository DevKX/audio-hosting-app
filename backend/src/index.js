const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
// CORS allow any frontend from diff origin ($web container blob storage) to make request to this backend
// For assessment purposes, both frontend and backend are hosted on same orgin
//app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Routes
// Authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// User management
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// Audio files management
const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);

// Audio data management
const audioRouter = require('./routes/audio');
app.use('/api/audio', audioRouter);


// Fallback to index.html for Single Page Application (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});