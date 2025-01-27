const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/db');


//Funzione che controlla i campi compilati per la registrazione
exports.validateRegister = [

    body('email')
    .isEmail()
    .withMessage('Invalid email'),
    body('password')
    .isLength({min: 6})
    .withMessage('La password deve essere lunga almeno 6 caratteri')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La password deve contenere almeno un numero e una lettera'),
    body('role').isIn(['USER','AGENT','MANAGER'])
    .withMessage('Ruolo non valido'),
    body('first_name')
    .notEmpty()
    .withMessage('Devi inserire il nome'),
    body('last_name')
    .notEmpty()
    .withMessage('Devi inserire il cognome'),
    body('phone').matches(/^\d{10}$/).withMessage('Numero di telefono non valido'),
    (req, res, next) => {
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

//Funzione che controlla se l'utente è autenticato
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Recupera il token dal header Authorization

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Aggiunge i dati dell'utente alla richiesta
        next();
    } catch (err) {
        logger.error(err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};


//Funzione che controlla i campi compilati per modificare il profile
exports.validateUpdatesProfile = [

    body('password')
    .isLength({min: 6})
    .withMessage('La password deve essere lunga almeno 6 caratteri')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La password deve contenere almeno un numero e una lettera'),
    body('phone').matches(/^\d{10}$/).withMessage('Numero di telefono non valido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];


// Middleware per autorizzare l'accesso in base al ruolo
exports.authorize = (roles) => {
    return async (req, res, next) => {
      const { role } = req.user; // ID dell'utente autenticato
      try {
        
        if (!roles || !roles.includes(role)) {
          return res.status(403).json({ success: false, message: 'Non hai il permesso per eseguire questa azione.' });
        }
  
        next();
      } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, message: 'Error checking user role' });
      }
    };
  };