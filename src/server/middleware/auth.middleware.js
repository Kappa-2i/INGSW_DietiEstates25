const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');



//Funzione che controlla i campi compilati per la registrazione
exports.validateRegister = [

    body('email')
    .isEmail()
    .withMessage('Email non valida'),
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


exports.validateUpdatesProfile = [
  // Validazione del telefono: opzionale; se presente deve essere esattamente 10 cifre
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Numero di telefono non valido'),

  // Se l'utente intende cambiare la password, devono essere inviati entrambi i campi.
  // Utilizziamo .if() per attivare la validazione solo se almeno uno dei due campi è presente.
  body('oldPassword')
    .if((value, { req }) => req.body.newPassword || req.body.oldPassword)
    .notEmpty()
    .withMessage('La vecchia password è richiesta per modificare la password'),
    
  body('newPassword')
    .if((value, { req }) => req.body.oldPassword || req.body.newPassword)
    .isLength({ min: 6 })
    .withMessage('La nuova password deve essere lunga almeno 6 caratteri')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La nuova password deve contenere almeno un numero e una lettera'),

  // Middleware finale per controllare errori di validazione e, se richiesto, confrontare le password
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Se non si sta modificando la password (entrambi i campi vuoti), prosegui
    if (!req.body.oldPassword || !req.body.newPassword) {
      return next();
    }
    try {
      // Verifica che la vecchia password fornita corrisponda a quella memorizzata
      const isMatch = await bcrypt.compare(req.body.oldPassword, req.user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'La vecchia password non corrisponde' }]
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }
];

