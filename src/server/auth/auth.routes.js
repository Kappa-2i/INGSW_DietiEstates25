const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { body } = require('express-validator');
const authMiddleware = require ('../middleware/auth.middleware');

//Rotta di registrazione
router.post( '/register', authMiddleware.validateRegister, authController.register);

//Rotta di login
router.post('/login', authController.login);

//Rotta per il logout dell'utente
router.post('/logout', authController.logout);


module.exports = router;