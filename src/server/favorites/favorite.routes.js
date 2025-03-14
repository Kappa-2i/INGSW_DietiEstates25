const express = require('express');
const router = express.Router();

const favoriteController = require('./favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Rotta per aggiungere un'inserzione ai preferiti.
 * L'utente deve essere autenticato.
 * @route POST /:insertionId
 * @access Protetto da Middleware di autenticazione
 */
router.post('/:insertionId', authMiddleware.authenticate, favoriteController.addFavorite);

/**
 * Rotta per recuperare tutte le inserzioni preferite dell'utente autenticato.
 * @route GET /
 * @access Protetto da Middleware di autenticazione
 */
router.get('/', authMiddleware.authenticate, favoriteController.getFavoritesByUser);

/**
 * Rotta per rimuovere un'inserzione dai preferiti.
 * L'utente deve essere autenticato.
 * @route DELETE /:insertionId
 * @access Protetto da Middleware di autenticazione
 */
router.delete('/:insertionId', authMiddleware.authenticate, favoriteController.removeFavorite);

module.exports = router;
