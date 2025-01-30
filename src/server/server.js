const express = require('express');
const cors = require('cors');
const app = express();
const logger = require('./utils/logger');

const port = process.env.PORT || 8000;

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./users/user.routes');
const insertionRoutes = require('./insertions/insertion.routes');
const offerRoutes = require('./offers/offer.routes');

app.use(express.json());
app.use(cors()); //Abilitare CORS per accedere alle richieste backend

//Rotte
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/insertion', insertionRoutes);
app.use('/api/offer', offerRoutes)

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

