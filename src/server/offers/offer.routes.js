const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');
const offerController = require('./offer.controller');

//Rotta per recuperare le inserzioni con offerte fatte da un utente
router.get('/my/all', authMiddleware.authenticate, authorizeMiddleware.authorize(["USER"]), offerController.getInsertionsWithOffer);

//Rotta per inserire un offerta manuale al di fuori del sistema
router.post('/manualCreation', authMiddleware.authenticate, authorizeMiddleware.authorize(["AGENT", "MANAGER", "ADMIN"]), offerController.createManualOffer);

//Rotta per inviare un offerta ad un agente
router.post('/creation/:insertionId', authMiddleware.authenticate, authorizeMiddleware.authorize(["USER"]), offerController.createOffer);

//Rotta per fare una contropoposta ad un offerta da parte di un utente o da parte di un agente (with patch)
router.post('/my/:offerId/counteroffer', authMiddleware.authenticate, offerController.counteroffer);

//Rotta per rifiutare un offerta da parte di un utente o da parte di un agente (with patch)
router.post('/my/:offerId/rejected', authMiddleware.authenticate, offerController.rejectOffer);

//Rotta per recuperare le offerte di una specifica inserzione
router.get('/my/:insertionId', authMiddleware.authenticate, offerController.getAllOffersByInsertionId);

//Rotta per recuperare le offerte su un inserzione specifica
router.get('/history/:insertionId', offerController.offersByInsertionId);

//Rotta per accettare un offerta da parte di un utente o da parte di un agente (with delete)
router.post('/my/:offerId/accepted', authMiddleware.authenticate, offerController.acceptOffer);


module.exports = router
