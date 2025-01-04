const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

// API URL from environment variables or default
const API_URL = process.env.API_URL || 'http://localhost:3001/number';

// Serve main page with rendered data
app.get('/', async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // Render HTML with fetched data
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Number Fetch App</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1 class="title">تعداد نمایش</h1>
          <div id="number-display" class="number-display">${data.number}</div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('خطا در سرور');
  }
});

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
