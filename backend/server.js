// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const predictionRoutes = require('./routes/predictions');
const axios = require('axios'); // Add axios for Gemini proxy

const app = express();
const PORT = 5002; // Unified backend runs on 5002

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// Database Connection
connectToDatabase().then(() => {
  console.log('Connected to MongoDB');

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/predictions', predictionRoutes);

  // Gemini Chatbot Proxy Route
  // Add GEMINI_API_KEY=your_key_here to your .env file
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  app.post('/api/gemini-chat', async (req, res) => {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not set in environment variables.' });
    }
    try {
      const { messages } = req.body;
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
        { contents: messages }
      );
      res.json(response.data);
    } catch (err) {
      console.error('Gemini API error:', err?.response?.data || err.toString());
      console.error('Request body:', req.body);
      res.status(500).json({ error: err.toString(), details: err?.response?.data });
    }
  });

  // Basic route
  app.get('/', (req, res) => {
    res.send('Crop Yield Prediction Backend Running');
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit if DB connection fails
});