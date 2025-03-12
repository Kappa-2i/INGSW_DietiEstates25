const logger = require('../utils/logger');


/**
 * Middleware per autorizzare l'accesso in base al ruolo.
 *
 * Se il ruolo dell'utente non è autorizzato, la richiesta viene interrotta con un errore 403.
 *
 * @param {string[]} roles - Array contenente i ruoli autorizzati.
 * @returns {Function} Middleware asincrono per la verifica del ruolo utente.
 *
 */
exports.authorize = (roles) => {
    return async (req, res, next) => {
      const { role } = req.user;
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