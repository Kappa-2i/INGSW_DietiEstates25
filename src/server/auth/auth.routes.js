const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const passport = require('./passport-config'); 
const jwt = require('jsonwebtoken');

//Rotta di registrazione
router.post( '/register', authMiddleware.validateRegister, authController.register);

//Rotta di login
router.post('/login', authController.login);

//Rotta per il logout dell'utente
router.post('/logout', authController.logout);

// Rotta per avviare l'autenticazione con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    // Redirect verso una pagina di "successo" che include il token nella query string
    res.redirect('http://localhost:3000/auth/success?token=' + token);
  }
);



module.exports = router;