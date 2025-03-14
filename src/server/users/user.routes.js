const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require ('../middleware/auth.middleware');
const authorizeMiddleware = require('../middleware/authorize.middleware');

/**
 * Rotta per ottenere le informazioni importanti dell'utente.
 * L'utente deve essere autenticato.
 * @route GET /profile
 * @access Protetto da Middleware di autenticazione
*/
router.get('/profile', authMiddleware.authenticate, userController.getUserProfile);

/**
 * Rotta per modificare password e cellulare dell'utente.
 * L'utente deve essere autenticato e devono essere validati i dati di aggiornamento.
 * @route PATCH /profile
 * @access Protetto da Middleware di autenticazione
*/
router.patch('/profile', authMiddleware.authenticate, authMiddleware.validateUpdatesProfile, userController.updateProfile);

//Rotta per modificare il profilo dei proprio agenti e manager
//router.patch('/myagent/:agentId', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), authMiddleware.validateUpdatesProfile, userController.updateAgent);

//Rotta per eliminare un profilo specifico
//router.delete('/myagent/:id', userController.deleteProfileById);

/**
 * Rotta per visualizzare tutti gli agenti associati a un manager.
 * L'utente deve essere autenticato e avere il ruolo di 'MANAGER' o 'ADMIN'.
 * @route GET /myagent
 * @access Protetto da Middleware di autenticazione e autorizzazione
*/
router.get('/myagent', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), userController.getMyAgents);

/**
 * Rotta per creare un nuovo agente.
 * L'utente deve essere autenticato e avere il ruolo di 'MANAGER' o 'ADMIN'.
 * I dati di registrazione dell'agente devono essere validati.
 * @route POST /myagent/creation
 * @access Protetto da Middleware di autenticazione e autorizzazione
*/
router.post('/myagent/creation', authMiddleware.authenticate, authorizeMiddleware.authorize(['MANAGER', 'ADMIN']), authMiddleware.validateRegister, userController.createAgent);

/**
 * Rotta per reimpostare la password dimenticata.
 * @route POST /forgetPassword
 * @access Pubblica
*/
router.post('/forgetPassword', userController.forgetPassword);

/**
 * Rotta per vedere tutti gli utenti registrati (solo per admin).
 * @route GET /profile/all
 * @access Protetta da Middleware di autenticazione (solo per admin)
*/
router.get('/profile/all', userController.getAllUsersProfile);

/**
 * Rotta per recuperare un agente tramite ID.
 * @route GET /:agentId
 * @access Protetto da Middleware di autenticazione
*/
router.get('/:agentId', userController.getAgentById);


module.exports = router;