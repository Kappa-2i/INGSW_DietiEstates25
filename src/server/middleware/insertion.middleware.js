const { body, validationResult } = require('express-validator');

exports.validateInputs = [
    //Converte `surface` in numero e controlla il range
    body('surface')
        .custom((value) => {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed) || parsed < 20 || parsed > 1000) {
                throw new Error('La superficie deve essere compresa tra 20 e 1000 mq');
            }
            return true;
        }),

    //Converte `contract` in maiuscolo per evitare problemi di case sensitivity
    body('contract')
        .custom((value) => {
            if (!['BUY', 'RENT'].includes(value.toUpperCase())) {
                throw new Error('Il contratto deve essere "BUY" o "RENT"');
            }
            return true;
        }),

    //Controlla che `cap` sia un numero di 5 cifre
    body('cap')
        .custom((value) => {
            if (!/^\d{5}$/.test(value)) {
                throw new Error('Il CAP deve essere composto da 5 cifre');
            }
            return true;
        }),

    //Controlla che `energyclass` sia valido (ignora il case)
    body('energyclass')
        .custom((value) => {
            const allowedValues = ['A4', 'A3', 'A2', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
            if (!allowedValues.includes(value.toUpperCase())) {
                throw new Error('La classe energetica deve essere una tra: A4, A3, A2, A, B, C, D, E, F, G');
            }
            return true;
        }),

    //Middleware per gestire errori
    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            console.log("validate:", req.body);
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];
