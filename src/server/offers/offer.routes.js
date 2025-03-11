const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');
const offerController = require('./offer.controller');

// Rotta per recuperare le inserzioni con offerte fatte da un utente.
// L'utente deve essere autenticato e avere il ruolo di "USER".
// @route GET /my/all
// @access Protetto da Middleware di autenticazione e autorizzazione
router.get('/my/all', authMiddleware.authenticate, authorizeMiddleware.authorize(["USER"]), offerController.getInsertionsWithOffer);

// Rotta per inserire un'offerta manuale al di fuori del sistema.
// Solo gli utenti con ruolo "AGENT", "MANAGER" o "ADMIN" possono accedere.
// @route POST /manualCreation
// @access Protetto da Middleware di autenticazione e autorizzazione
router.post('/manualCreation', authMiddleware.authenticate, authorizeMiddleware.authorize(["AGENT", "MANAGER", "ADMIN"]), offerController.createManualOffer);

// Rotta per inviare un'offerta ad un agente.
// L'utente deve essere autenticato e avere il ruolo di "USER".
// @route POST /creation/:insertionId
// @access Protetto da Middleware di autenticazione e autorizzazione
router.post('/creation/:insertionId', authMiddleware.authenticate, authorizeMiddleware.authorize(["USER"]), offerController.createOffer);

// Rotta per fare una controproposta ad un'offerta da parte di un utente o da parte di un agente.
// @route POST /my/:offerId/counteroffer
// @access Protetto da Middleware di autenticazione
router.post('/my/:offerId/counteroffer', authMiddleware.authenticate, offerController.counteroffer);

// Rotta per rifiutare un'offerta da parte di un utente o da parte di un agente.
// @route POST /my/:offerId/rejected
// @access Protetto da Middleware di autenticazione
router.post('/my/:offerId/rejected', authMiddleware.authenticate, offerController.rejectOffer);

// Rotta per recuperare le offerte di una specifica inserzione.
// L'utente deve essere autenticato.
// @route GET /my/:insertionId
// @access Protetto da Middleware di autenticazione
router.get('/my/:insertionId', authMiddleware.authenticate, offerController.getAllOffersByInsertionId);

// Rotta per recuperare le offerte su un'inserzione specifica.
// @route GET /history/:insertionId
router.get('/history/:insertionId', offerController.offersByInsertionId);

// Rotta per accettare un'offerta da parte di un utente o da parte di un agente.
// @route POST /my/:offerId/accepted
// @access Protetto da Middleware di autenticazione
router.post('/my/:offerId/accepted', authMiddleware.authenticate, offerController.acceptOffer);

// Rotta per recuperare i dettagli della controfferta per un'offerta specifica.
// L'utente deve essere autenticato.
// @route GET /my/:offerId/counteroffer/details
// @access Protetto da Middleware di autenticazione
router.get('/my/:offerId/counteroffer/details',authMiddleware.authenticate, offerController.getCounterOfferDetails);


module.exports = router
