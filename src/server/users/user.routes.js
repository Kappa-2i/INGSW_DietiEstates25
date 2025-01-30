const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');

//Rotta per ottenere le informazioni importanti dell'utente
router.get('/profile', authMiddleware.authenticate, userController.getUserProfile);

//Rotta per modificare password e cellulare dell'utente
router.patch('/profile', authMiddleware.authenticate, authMiddleware.validateUpdatesProfile, userController.updateProfile);

//Rotta per modificare il profilo dei proprio agenti e manager
router.patch('/myagent/:agentId', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), authMiddleware.validateUpdatesProfile, userController.updateAgent);

//Rotta per eliminare un profilo specifico
router.delete('/myagent/:id', userController.deleteProfileById);

//Rotta per visualizzare tutti i miei agenti
router.get('/myagent', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), userController.getMyAgents);

//Rotta per creare un nuovo agente
router.post('/myagent/creation', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), userController.createAgent);

//Rotta per vedere tutti gli utenti registrati (adm)
router.get('/profile/all', userController.getAllUsersProfile);



module.exports = router;