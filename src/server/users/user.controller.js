const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const User = require('../models/User');

/**
 * Recupera il profilo utente.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i dati dell'utente o messaggio di errore.
*/
exports.getUserProfile = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        res.status(200).json({ success: true, data: user.toJSON() });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Aggiorna il profilo utente.
 * @param {Object} req - Oggetto della richiesta HTTP contenente i dati dell'utente.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i dati aggiornati dell'utente o messaggio di errore.
 */
exports.updateProfile = async (req, res) => {
    const { id } = req.user;
    const { phone, oldPassword, newPassword } = req.body;

    try {
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        // Creiamo un oggetto per i dati da aggiornare
        const updateData = {};

        if (phone) {
            updateData.phone = phone;
        }

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: 'Devi inserire la password attuale per cambiarla' });
            }

            const isMatch = await user.checkPassword(oldPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'La password attuale non è corretta' });
            }

            updateData.hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'Nessun dato aggiornato' });
        }

        const updatedUser = await userRepository.updateProfile(id, updateData.hashedPassword, updateData.phone);
        res.status(200).json({ success: true, data: updatedUser.toJSON() });
    } catch (err) {
        console.error('Error updating user profile:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera tutti i profili utente.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con la lista di tutti gli utenti o messaggio di errore.
 */
exports.getAllUsersProfile = async (req, res) => {
    try {
        const allUsers = await userRepository.getAllUsersProfile();
        if (!allUsers) {
            return res.status(404).json({ success: false, message: 'Utenti non trovati' });
        }

        res.status(200).json({ success: true, data: allUsers.map(user => user.toJSON()) });
    } catch (err) {
        console.error('Error fetching user profiles:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Elimina un profilo utente tramite ID.
 * @param {Object} req - Oggetto della richiesta HTTP con l'ID dell'utente da eliminare.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con lo stato dell'eliminazione o messaggio di errore.
 */
exports.deleteProfileById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProfile = await userRepository.deleteProfileById(id);

        if (!deletedProfile) {
            return res.status(404).json({ success: false, message: 'Utente non trovato.' });
        }

        res.status(200).json({ success: true, data: deletedProfile.toJSON() });
    } catch (err) {
        console.error('Error deleting user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Aggiorna un agente (manager modifica un agente).
 * @param {Object} req - Oggetto della richiesta HTTP contenente i dati dell'agente e l'ID del manager.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i dati aggiornati dell'agente o messaggio di errore.
 */
exports.updateAgent = async (req, res) => {
    const { agentId } = req.params;
    const { id } = req.user;
    const { password, phone } = req.body;

    try {
        const checkValidate = await userRepository.checkValidateUpdatesAgent(agentId);

        if (checkValidate.supervisor !== id) {
            return res.status(404).json({ success: false, message: "Non hai i permessi per modificare questo utente" });
        }

        const isMatch = await bcrypt.compare(password, checkValidate.password);
        if (isMatch) {
            return res.status(400).json({ success: false, message: "Devi utilizzare una password diversa" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAgent = await userRepository.updateProfile(agentId, hashedPassword, phone);

        if (!updatedAgent) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        res.status(200).json({ success: true, data: updatedAgent.toJSON() });
    } catch (err) {
        console.error('Error updating agent:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Recupera gli agenti associati a un manager.
 * @param {Object} req - Oggetto della richiesta HTTP contenente l'ID del manager.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con la lista degli agenti o messaggio di errore.
*/
exports.getMyAgents = async (req, res) => {
    try {
        const { id } = req.user;
        const agents = await userRepository.getAgentsByManagerId(id);
        if (!agents || agents.length === 0) {
            return res.status(404).json({ success: false, message: 'Nessun agente trovato' });
        }

        res.status(200).json({ success: true, data: agents.map(agent => agent.toJSON()) });
    } catch (err) {
        console.error('Errore durante il recupero degli agenti:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Crea un nuovo agente.
 * @param {Object} req - Oggetto della richiesta HTTP contenente i dati dell'agente.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i dati del nuovo agente o messaggio di errore.
*/
exports.createAgent = async (req, res) => {
    const { first_name, last_name, email, password, phone, role } = req.body;
    const { id: supervisorId } = req.user;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailAlreadyExists = await userRepository.emailAlreadyExists(email);
        if (!emailAlreadyExists){
            const newAgent = await userRepository.createAgent(first_name, last_name, email, hashedPassword, phone, supervisorId, role);
            res.status(201).json({ success: true, message: 'Agente creato con successo', data: newAgent.toJSON() });
        }
        res.status(208).json({ success: false, message: 'Email non valida'});
        
    } catch (err) {
        console.error('Errore nella creazione dell\'agente:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Reset password dimenticata.
 * @param {Object} req - Oggetto della richiesta HTTP contenente l'email e la nuova password.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con il messaggio di successo o errore.
*/
exports.forgetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userRepository.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: "Email non trovata" });
        }

        await userRepository.updateProfile(user.id, hashedPassword, null);
        res.status(201).json({ success: true, message: 'Nuova password impostata con successo' });
    } catch (err) {
        console.error('Errore nel reset della password:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Recupera un agente tramite il suo ID.
 * @param {Object} req - Oggetto della richiesta HTTP contenente l'ID dell'agente.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i dati dell'agente o messaggio di errore.
*/
exports.getAgentById = async (req, res) => {
    const { agentId } = req.params;
    try{
        const agentById = await userRepository.getAgentById(agentId);
        if (!agentById) {
            return res.status(404).json({ success: false, message: "Agente non trovato" });
        }

        res.status(201).json({ success: true, message: 'Agente trovato con successo', data: agentById.toJSON() });
    } catch (err) {
        console.error('Errore nel trovare agente tramite id:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}