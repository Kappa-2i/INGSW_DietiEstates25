const express = require('express');
const router = express.Router();

const favoriteController = require('./favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rotta per aggiungere un'inserzione ai preferiti
router.post('/:insertionId', authMiddleware.authenticate, favoriteController.addFavorite);

// Rotta per recuperare le inserzioni preferite dell'utente
router.get('/', authMiddleware.authenticate, favoriteController.getFavoritesByUser);

// Rotta per rimuovere un'inserzione dai preferiti
router.delete('/:insertionId', authMiddleware.authenticate, favoriteController.removeFavorite);

module.exports = router;
