const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');



/**
 * Middleware di validazione per la registrazione utente.
 *
 * Verifica che i campi inviati siano validi:
 * - **email**: deve essere un indirizzo email valido.
 * - **password**: deve essere lunga almeno 6 caratteri e contenere almeno una lettera e un numero.
 * - **role**: il ruolo deve essere uno tra 'USER', 'AGENT' o 'MANAGER'.
 * - **first_name**: non deve essere vuoto.
 * - **last_name**: non deve essere vuoto.
 * - **phone**: deve essere composto esattamente da 10 cifre.
 *
 * Se la validazione fallisce, viene restituito un errore HTTP 400 con l'elenco degli errori.
 */
exports.validateRegister = [

    body('email')
    .isEmail()
    .withMessage('Email non valida.\n'),
    body('password')
    .isLength({min: 6})
    .withMessage('La password deve essere lunga almeno 6 caratteri.\n')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La password deve contenere almeno un numero e una lettera.\n'),
    body('role').isIn(['USER','AGENT','MANAGER'])
    .withMessage('Ruolo non valido.\n'),
    body('first_name')
    .notEmpty()
    .withMessage('Devi inserire il nome.\n'),
    body('last_name')
    .notEmpty()
    .withMessage('Devi inserire il cognome.\n'),
    body('phone').matches(/^\d{10}$/).withMessage('Numero di telefono non valido.\n'),
    (req, res, next) => {
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

/**
 * Middleware di autenticazione.
 *
 * Verifica tramite il token se l'utente è correttamente autenticato.
 *
 * In caso di token mancante, non valido o scaduto, risponde con un errore HTTP 401.
 *
 * @param {object} req - Oggetto della richiesta HTTP.
 * @param {object} res - Oggetto della risposta HTTP.
 * @param {function} next - Funzione di callback per passare il controllo al middleware successivo.
 */
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Recupera il token dal header Authorization

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Aggiunge i dati dell'utente alla richiesta
        next();
    } catch (err) {
        logger.error(err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

/**
 * Middleware di validazione per l'aggiornamento del profilo utente.
 *
 * - **phone**: deve essere composto esattamente da 10 cifre.
 *
 * Se l'utente intende modificare la password, devono essere presenti entrambi i campi:
 * - **oldPassword**: la vecchia password.
 * - **newPassword**: la nuova password, che deve essere lunga almeno 6 caratteri e contenere almeno una lettera e un numero.
 *
 * In caso di errori di validazione, risponde con un errore HTTP 400 contenente l'elenco degli errori.
 */
exports.validateUpdatesProfile = [
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Numero di telefono non valido'),

  
  body('oldPassword')
    // Utilizziamo .if() per attivare la validazione solo se almeno uno dei due campi è presente.
    .if((value, { req }) => req.body.newPassword || req.body.oldPassword)
    .notEmpty()
    .withMessage('La vecchia password è richiesta per modificare la password'),
    
  body('newPassword')
    .if((value, { req }) => req.body.oldPassword || req.body.newPassword)
    .isLength({ min: 6 })
    .withMessage('La nuova password deve essere lunga almeno 6 caratteri')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La nuova password deve contenere almeno un numero e una lettera'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    if (!req.body.oldPassword || !req.body.newPassword) {
      return next();
    }
    try {
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

