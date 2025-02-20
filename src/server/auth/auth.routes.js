const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const passport = require('../config/passport-config'); 
const jwt = require('jsonwebtoken');

//Rotta di registrazione
router.post( '/register', authMiddleware.validateRegister, authController.register);

//Rotta di login
router.post('/login', authController.login);

//Rotta per il logout dell'utente
router.post('/logout', authController.logout);

//Rotta per avviare l'autenticazione con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//Rotta per accedere/registrarsi con Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);



module.exports = router;