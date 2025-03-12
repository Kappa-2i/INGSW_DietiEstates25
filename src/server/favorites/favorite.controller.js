const favoriteRepository = require('../repositories/favorite.repository');
const Favorites = require('../models/Favorite');

/**
 * Aggiunge un'inserzione ai preferiti di un utente.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con lo stato dell'operazione e i dati aggiornati.
 */
exports.addFavorite = async (req, res) => {
    try {
        const { id: userid } = req.user;
        const { insertionId } = req.params;

        const favorite = await favoriteRepository.addFavorite(userid, insertionId);
        if (!favorite) {
            return res.status(409).json({ success: false, message: 'L\'inserzione è già nei preferiti' });
        }

        res.status(201).json({ success: true, data: favorite.toJSON() });
    } catch (err) {
        console.error('Errore nell\'aggiunta ai preferiti:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera tutte le inserzioni preferite di un utente.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta contenente l'elenco delle inserzioni preferite dell'utente.
 */
exports.getFavoritesByUser = async (req, res) => {
    try {
        const { id: userid } = req.user;
        const favorites = await favoriteRepository.getFavoritesByUser(userid);

        if (!favorites.length) {
            return res.status(404).json({ success: false, message: 'Nessun preferito trovato' });
        }

        res.status(200).json({ success: true, data: favorites.map(fav => fav.toJSON()) });
    } catch (err) {
        console.error('Errore nel recupero dei preferiti:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Rimuove un'inserzione dai preferiti di un utente.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con lo stato dell'operazione.
 */
exports.removeFavorite = async (req, res) => {
    try {
        const { id: userid } = req.user;
        const { insertionId } = req.params;
        
        const removedFavorite = await favoriteRepository.removeFavorite(userid, insertionId);
        if (!removedFavorite) {
            return res.status(404).json({ success: false, message: 'L\'inserzione non era nei preferiti' });
        }

        res.status(200).json({ success: true, message: 'Inserzione rimossa dai preferiti' });
    } catch (err) {
        console.error('Errore nella rimozione dai preferiti:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};
