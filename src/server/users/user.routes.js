const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require ('../middleware/auth.middleware');

//Rotta per ottenere le informazioni importanti dell'utente
router.get('/profile', authMiddleware.authenticate, userController.getUserProfile);

//Rotta per modificare password e cellulare dell'utente
router.patch('/profile', authMiddleware.authenticate, authMiddleware.validateUpdatesProfile, userController.updateProfile);

//Rotta per modificare il profilo dei proprio agenti e i manager
router.patch('/profile/:id', authMiddleware.authenticate, authMiddleware.authorize(['MANAGER', 'ADMIN']), authMiddleware.validateUpdatesProfile, userController.updateAgent);

//Rotta per vedere tutti gli utenti registrati (adm)
router.get('/profile/all', userController.getAllUsersProfile);

//Rotta per eliminare un profilo specifico (adm)
router.delete('/profile/:id', userController.deleteProfileById);

module.exports = router;