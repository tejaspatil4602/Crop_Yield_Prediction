const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyC7z38cFkmWCqiOHpuBhStFh3LiDzkH5qw';

app.post('/api/gemini-chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY,
      { contents: messages }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString(), details: err?.response?.data });
  }
});

app.listen(5002, () => console.log('Server running on port 5002')); 