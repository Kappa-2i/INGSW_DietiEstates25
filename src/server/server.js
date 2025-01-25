const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors()); //Abilitare CORS per accedere alle richieste backend

const authRoutes = require('./auth/auth.routes');

//Rotte
app.use('/api/auth', authRoutes);



// Avvio del server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
