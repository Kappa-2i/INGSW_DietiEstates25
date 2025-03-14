const { body, validationResult } = require('express-validator');

exports.validateInputs = [
  // Testo: non devono essere vuoti
  body('title')
    .notEmpty().withMessage('Il titolo è richiesto'),

  body('description')
    .notEmpty().withMessage('La descrizione è richiesta'),

  // Prezzo: non vuoto e numerico
  body('price')
    .notEmpty().withMessage('Il prezzo è richiesto')
    .isNumeric().withMessage('Il prezzo deve essere un numero'),

  // Superficie: non vuota, numerica e compresa tra 20 e 2000
  body('surface')
    .notEmpty().withMessage('La superficie è richiesta')
    .isNumeric().withMessage('La superficie deve essere un numero')
    .custom((value) => {
      const num = parseFloat(value);
      if (num < 20 || num > 2000) {
        throw new Error('La superficie deve essere compresa tra 20 e 2000 mq');
      }
      return true;
    }),

  // Camere, Bagni, Balconi
  body('room')
    .notEmpty().withMessage('Il numero di camere è richiesto')
    .isInt({ min: 1 }).withMessage('Il numero di camere deve essere almeno 1'),

  body('bathroom')
    .notEmpty().withMessage('Il numero di bagni è richiesto')
    .isInt({ min: 1 }).withMessage('Il numero di bagni deve essere almeno 1'),

  body('balcony')
    .notEmpty().withMessage('Il numero di balconi è richiesto')
    .isInt({ min: 0 }).withMessage('Il numero di balconi deve essere almeno 0'),

  // Contratto: deve essere "BUY" o "RENT"
  body('contract')
    .notEmpty().withMessage('Il contratto è richiesto')
    .custom((value) => {
      if (!['BUY', 'RENT'].includes(value.toUpperCase())) {
        throw new Error('Il contratto deve essere "BUY" o "RENT"');
      }
      return true;
    }),

  // Regione, Provincia, Comune
  body('region')
    .notEmpty().withMessage('La regione è richiesta'),

  body('province')
    .notEmpty().withMessage('La provincia è richiesta'),

  body('municipality')
    .notEmpty().withMessage('Il comune è richiesto'),

  // CAP: esattamente 5 cifre
  body('cap')
    .notEmpty().withMessage('Il CAP è richiesto')
    .matches(/^\d{5}$/).withMessage('Il CAP deve essere composto da 5 cifre'),

  // Indirizzo e numero civico
  body('address')
    .notEmpty().withMessage("L'indirizzo è richiesto"),

  body('house_number')
    .notEmpty().withMessage('Il numero civico è richiesto'),

  // Piano: non vuoto e intero
  body('floor')
    .notEmpty().withMessage('Il piano è richiesto')
    .isInt().withMessage('Il piano deve essere un numero intero'),

  // Classe energetica: deve essere tra i valori consentiti
  body('energyclass')
    .notEmpty().withMessage('La classe energetica è richiesta')
    .custom((value) => {
      const allowedValues = ['A4', 'A3', 'A2', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
      if (!allowedValues.includes(value.toUpperCase())) {
        throw new Error('La classe energetica deve essere una tra: A4, A3, A2, A, B, C, D, E, F, G');
      }
      return true;
    }),

  // Campi booleani: verifichiamo che esistano (anche se false è valido)
  body('garage')
    .exists().withMessage('Il campo garage è richiesto')
    .isBoolean().withMessage('Il campo garage deve essere booleano'),

  body('garden')
    .exists().withMessage('Il campo giardino è richiesto')
    .isBoolean().withMessage('Il campo giardino deve essere booleano'),

  body('elevator')
    .exists().withMessage('Il campo ascensore è richiesto')
    .isBoolean().withMessage('Il campo ascensore deve essere booleano'),

  body('climate')
    .exists().withMessage('Il campo climatizzazione è richiesto')
    .isBoolean().withMessage('Il campo climatizzazione deve essere booleano'),

  body('terrace')
    .exists().withMessage('Il campo terrazzo è richiesto')
    .isBoolean().withMessage('Il campo terrazzo deve essere booleano'),

  body('reception')
    .exists().withMessage('Il campo portineria è richiesto')
    .isBoolean().withMessage('Il campo portineria deve essere booleano'),

  // Middleware per gestire gli errori di validazione
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("validate:", req.body);
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
