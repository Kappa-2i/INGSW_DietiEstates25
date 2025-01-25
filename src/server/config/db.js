require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

// Configurazione del client PostgreSQL
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true, // Verifica il certificato SSL
    ca: fs.readFileSync(process.env.DB_SSL_CA).toString() // Percorso del file PEM
  }
});

client.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = client;
