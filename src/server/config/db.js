const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();


// Configurazione del client PostgreSQL
const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true, // Verifica il certificato SSL
    ca: fs.readFileSync(process.env.DB_SSL_CA).toString() // Percorso del file PEM
  },
};

const pool = new Pool(DB_CONFIG);

// pool.connect()
//   .then(() => console.log('Database connected successfully'))
//   .catch(err => console.error('Database connection error:', err));

module.exports = { pool };
