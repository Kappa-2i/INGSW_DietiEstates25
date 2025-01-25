const express = require('express');
const client = require('./config/db'); // Importa il client dal file db.js
const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

//Rotte

// Test del database
app.get('/test-db', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()'); // Query di test
    res.status(200).json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
