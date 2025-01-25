const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');

exports.validateRegister = [

    body('email')
    .isEmail()
    .withMessage('Invalid email'),
    body('password')
    .isLength({min: 6})
    .withMessage('La password deve essere lunga almeno 6 caratteri')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)
    .withMessage('La password deve contenere almeno un numero e una lettera'),
    body('role').isIn(['user','agent','manager'])
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