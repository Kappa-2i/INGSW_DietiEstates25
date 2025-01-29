const logger = require('../utils/logger');


// Middleware per autorizzare l'accesso in base al ruolo
exports.authorize = (roles) => {
    return async (req, res, next) => {
      const { role } = req.user; // Ruolo dell'utente autenticato
      try {
        
        if (!roles || !roles.includes(role)) {
          return res.status(403).json({ success: false, message: 'Non hai il permesso per eseguire questa azione.' });
        }
        
        next();
      } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, message: 'Error checking user role' });
      }
    };
};