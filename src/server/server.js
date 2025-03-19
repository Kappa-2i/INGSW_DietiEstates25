// Importazione dei moduli necessari
const express = require('express'); // Framework web per Node.js
const cors = require('cors'); // Middleware per abilitare richieste CORS
const app = express(); // Creazione di un'istanza dell'app Express
const logger = require('./utils/logger'); // Modulo per la gestione dei log
const passport = require('./config/passport-config'); // Configurazione di Passport per l'autenticazione
const session = require('express-session'); // Middleware per la gestione delle sessioni

// Definizione della porta su cui il server verrà avviato
const port = process.env.PORT || 8000;

// Importazione delle route dell'applicazione
const authRoutes = require('./auth/auth.routes'); // Rotte per l'autenticazione
const userRoutes = require('./users/user.routes'); // Rotte per la gestione degli utenti
const insertionRoutes = require('./insertions/insertion.routes'); // Rotte per le inserzioni
const favoriteRoutes = require('./favorites/favorite.routes'); // Rotte per i preferiti
const offerRoutes = require('./offers/offer.routes'); // Rotte per le offerte

// Configurazione della sessione
app.use(session({
  secret: process.env.SECRET_KEY, // Chiave segreta per firmare la sessione
  resave: false, // Evita di salvare la sessione se non è stata modificata
  saveUninitialized: false // Non salva sessioni vuote
}));

// Middleware globali
app.use(express.json()); // Permette di analizzare il corpo delle richieste in JSON
app.use(cors()); // Abilita CORS per le richieste cross-origin
app.use(passport.initialize()); // Inizializza Passport per l'autenticazione
app.use(passport.session()); // Permette a Passport di gestire le sessioni

// Definizione delle rotte API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/insertion', insertionRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/offer', offerRoutes);

// Middleware di gestione degli errori
app.use((err, req, res, next) => {
  logger.error(err); // Registra l'errore nei log
  res.status(500).json({ success: false, message: err.message }); // Restituisce una risposta di errore
});

// Avvio del server solo se il file è eseguito direttamente
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sull'indirizzo http://0.0.0.0:${port}`);
  });
}

// Esportazione dell'app per permettere l'uso in altri file (es. per i test)
module.exports = app;
