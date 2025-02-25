const express = require('express');
const router = express.Router();

const insertionController = require('./insertion.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');
const insertionMiddleware = require('../middleware/insertion.middleware');

//Rotta per ottenere tutte le inserzioni
router.get('/', insertionController.getAllInsertions);

//Rotta per ottenere le ultime inserzioni
router.get('/last', insertionController.getLastInsertions);

//Rotta per ottenere inserzioni tramite ricerca avanzata
router.post('/filtered', insertionController.getFilteredInsertions);

//Rotta per ottenere le inserzioni preferite di un utente
//router.get('/favorites', authMiddleware.authenticate, insertionController.getFavoritesByUser);

//Rotta per ottenere le inserzioni pubblicate da un'agente
router.get('/my', authMiddleware.authenticate, authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.getMyInsertions);

//Rotta per aggiungere un inserzione
router.post('/creation', authMiddleware.authenticate, authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), uploadMiddleware.upload, insertionMiddleware.validateInputs, insertionController.createInsertion);

//Rotta per ottenere POI vicini all'inserzione
router.get("/:insertionId/pois", insertionController.getPOIsForInsertion);

//Rotta per eliminare un inserzione specifica tramite ID
router.delete('/:id', authMiddleware.authenticate,  authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.deleteInsertionById);

//Rotta per ottenere un inserzione specifica tramite ID
router.get('/:id', insertionController.getInsertionById);

//Rotta per aggiungere un inserzione ai preferiti
//router.post('/favorites/:insertionId', authMiddleware.authenticate, insertionController.addFavorite);

//Rotta per rimuovere un iserzione dai preferiti
//router.delete('/favorites/:insertionId', authMiddleware.authenticate, insertionController.removeFavorite);

//Rotta per modificare un inserzione specifica tramite ID
//router.put('/:id', authMiddleware.authenticate,  authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.updateInsertionById);

module.exports = router;