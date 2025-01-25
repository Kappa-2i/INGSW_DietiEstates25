const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors()); //Abilitare CORS per accedere alle richieste backend
const logger = require('./utils/logger');

const authRoutes = require('./auth/auth.routes');

//Rotte
app.use('/api/auth', authRoutes);

// Gestione degli errori generali
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ success: false, message: err.message });
});


// Avvio del server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

