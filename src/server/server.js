const express = require('express');
const cors = require('cors');
const app = express();
const logger = require('./utils/logger');
const passport = require('./config/passport-config'); // Assicurati che il percorso sia corretto
const session = require('express-session');



const port = process.env.PORT || 8000;


const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./users/user.routes');
const insertionRoutes = require('./insertions/insertion.routes');
const favoriteRoutes = require('./favorites/favorite.routes');
const offerRoutes = require('./offers/offer.routes');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(cors()); //Abilitare CORS per accedere alle richieste backend
app.use(passport.initialize());
app.use(passport.session());

//Rotte
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/insertion', insertionRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/offer', offerRoutes);

// Gestione degli errori generali
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ success: false, message: err.message });
});


// Esporta l'app per i test
module.exports = app;

// Avvio del server solo se il file viene eseguito direttamente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

