const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const passport = require('../config/passport-config'); 

/**
 * Rotta per la registrazione di un nuovo utente.
 * @route POST /register
 * @middleware validateRegister - Middleware per la validazione dei dati di registrazione.
 * @controller register - Controller per la registrazione dell'utente.
 */
router.post( '/register', authMiddleware.validateRegister, authController.register);

/**
 * Rotta per il login di un utente.
 * @route POST /login
 * @controller login - Controller per l'autenticazione dell'utente.
 */
router.post('/login', authController.login);

/**
 * Rotta per il logout dell'utente.
 * @route POST /logout
 * @controller logout - Controller per il logout dell'utente.
 */
router.post('/logout', authController.logout);

/**
 * Rotta per avviare l'autenticazione con Google.
 * @route GET /google
 * @middleware passport.authenticate - Middleware di autenticazione con Google.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * Rotta per la callback dell'autenticazione con Google.
 * @route GET /google/callback
 * @middleware passport.authenticate - Middleware per gestire l'autenticazione.
 * @controller googleCallback - Controller per gestire la risposta dopo l'autenticazione con Google.
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);



module.exports = router;