const express = require('express');
const router = express.Router();

const insertionController = require('./insertion.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');
const insertionMiddleware = require('../middleware/insertion.middleware');

/**
 * Rotta per ottenere tutte le inserzioni.
 * @route GET /
 * @controller getAllInsertions - Controller per ottenere tutte le inserzioni.
 */
router.get('/', insertionController.getAllInsertions);

/**
 * Rotta per ottenere le ultime inserzioni.
 * @route GET /last
 * @controller getLastInsertions - Controller per ottenere le ultime inserzioni.
 */
router.get('/last', insertionController.getLastInsertions);

/**
 * Rotta per ottenere inserzioni tramite ricerca avanzata.
 * @route POST /filtered
 * @controller getFilteredInsertions - Controller per ottenere inserzioni tramite ricerca avanzata.
 */
router.post('/filtered', insertionController.getFilteredInsertions);

//Rotta per ottenere le inserzioni preferite di un utente
//router.get('/favorites', authMiddleware.authenticate, insertionController.getFavoritesByUser);

/**
 * Rotta per ottenere le inserzioni pubblicate da un agente.
 * @route GET /my
 * @controller getMyInsertions - Controller per ottenere le inserzioni pubblicate da un agente.
 */
router.get('/my', authMiddleware.authenticate, authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.getMyInsertions);

/**
 * Rotta per aggiungere una nuova inserzione.
 * @route POST /creation
 * @controller createInsertion - Controller per creare una nuova inserzione.
 */
router.post('/creation', authMiddleware.authenticate, authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), uploadMiddleware.upload, insertionMiddleware.validateInputs, insertionController.createInsertion);

/**
 * Rotta per ottenere i punti di interesse (POI) vicini all'inserzione.
 * @route GET /:insertionId/pois
 * @controller getPOIsForInsertion - Controller per ottenere i POI vicini all'inserzione.
 */
router.get("/:insertionId/pois", insertionController.getPOIsForInsertion);

/**
 * Rotta per eliminare una specifica inserzione tramite ID.
 * @route DELETE /:id
 * @controller deleteInsertionById - Controller per eliminare una specifica inserzione.
 */
router.delete('/:id', authMiddleware.authenticate,  authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.deleteInsertionById);

/**
 * Rotta per ottenere una specifica inserzione tramite ID.
 * @route GET /:id
 * @controller getInsertionById - Controller per ottenere una specifica inserzione.
 */
router.get('/:id', insertionController.getInsertionById);

//Rotta per aggiungere un inserzione ai preferiti
//router.post('/favorites/:insertionId', authMiddleware.authenticate, insertionController.addFavorite);

//Rotta per rimuovere un iserzione dai preferiti
//router.delete('/favorites/:insertionId', authMiddleware.authenticate, insertionController.removeFavorite);

//Rotta per modificare un inserzione specifica tramite ID
//router.put('/:id', authMiddleware.authenticate,  authorizeMiddleware.authorize(['AGENT', 'MANAGER', 'ADMIN']), insertionController.updateInsertionById);

module.exports = router;