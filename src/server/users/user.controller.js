const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const userRepository = require('../repositories/user.repositories');



// Recupera il profilo utente
exports.getUserProfile = async (req, res) => {
    const { id } = req.user;
    console.log(id);
  
    try {
      const user = await userRepository.findById(id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utente non trovato' });
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { id } = req.user;
    const { password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser = await userRepository.updateProfile(id, hashedPassword, phone);
        if (!updateUser) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        res.status(200).json({ success: true, data: updateUser });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getAllUsersProfile = async (req, res) => {
    try {
        const allUsers = await userRepository.getAllUsersProfile();
        if (!allUsers) {
            return res.status(404).json({ success: false, message: 'Utenti non trovati' });
        }

        res.status(200).json({ success: true, data: allUsers});
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.deleteProfileById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProfile = await userRepository.deleteProfileById(id);
    
        if (!deletedProfile) {
          return res.status(404).json({ success: false, message: 'Utente non trovato.' });
        }
    
        res.status(200).json({ success: true, data: deletedProfile });
      } catch (err) {
        logger.error('Error fetching user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
};


exports.updateAgent = async (req, res) => {
    const { agentId } = req.params;
    const { id } = req.user;
    const { password, phone } = req.body;
    console.log(id);
    try {

        //Chiamata a repository per prendere la password e l'id del supervisore da controllare
        const checkValidate = await userRepository.checkValidateUpdatesAgent(agentId);

        //Controlla se il manager ha i permessi per modificare l'agente 
        const isMatchSupervisor = checkValidate.supervisor === id;
        if (!isMatchSupervisor){
            return res.status(404).json({success: false, message: "Non hai i permessi per modificare questo utente"});
        }

        //Controlla se la nuova password è uguale alla vecchia
        const isMatch = await bcrypt.compare(password, checkValidate.password);
        if (isMatch){
            return res.status(400).json({success: false, message: "Devi utilizzare una password diversa"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser = await userRepository.updateProfile(agentId, hashedPassword, phone);
        if (!updateUser) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        res.status(200).json({ success: true, data: updateUser });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};