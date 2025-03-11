const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();


/**
 * Configurazione del client PostgreSQL.
 * @constant {Object} DB_CONFIG - Contiene i parametri di connessione al database.
 * @property {string} host - Indirizzo del server del database.
 * @property {number} port - Porta del database.
 * @property {string} database - Nome del database.
 * @property {string} user - Nome utente per l'autenticazione.
 * @property {string} password - Password per l'autenticazione.
 * @property {Object} ssl - Configurazione SSL.
 * @property {boolean} ssl.rejectUnauthorized - Se true, verifica il certificato SSL.
 * @property {string} ssl.ca - Contenuto del certificato SSL.
 */
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

/**
 * Pool di connessioni per PostgreSQL.
 * @constant {Pool} pool - Istanza del pool di connessione.
 */
const pool = new Pool(DB_CONFIG);

/**
 * Connessione al database.
 * Logga un messaggio in caso di connessione avvenuta con successo o errore in caso di fallimento.
 */
pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = { pool };
