const { pool } = require('../config/db');
const Favorite = require('../models/Favorite');

class FavoriteRepository {
    /**
     * Aggiunge un'inserzione ai preferiti di un utente.
     * @param userid - ID dell'utente.
     * @param insertionid - ID dell'inserzione.
     * @returns {Promise<Favorite|null>} - Istanza `Favorite` o `null` se già esistente.
     */
    async addFavorite(userid, insertionid) {
        const query = `
            INSERT INTO favorites (userid, insertionid)
            VALUES ($1, $2)
            ON CONFLICT (userid, insertionid) DO NOTHING
            RETURNING *;
        `;
        const result = await pool.query(query, [userid, insertionid]);
        return result.rows.length ? Favorite.fromDatabase(result.rows[0]) : null;
    }

    /**
     * Recupera tutte le inserzioni preferite di un utente.
     * @param userid - ID dell'utente.
     * @returns {Promise<Favorite[]>} - Lista delle inserzioni preferite.
     */
    async getFavoritesByUser(userid) {
        const query = `
            SELECT f.*
            FROM favorites f
            JOIN insertions i ON f.insertionid = i.id
            WHERE f.userid = $1;
        `;
        const result = await pool.query(query, [userid]);
        return result.rows.map(row => Favorite.fromDatabase(row));
    }

    /**
     * Rimuove un'inserzione dai preferiti di un utente.
     * @param userid - ID dell'utente.
     * @param insertionid - ID dell'inserzione.
     * @returns {Promise<Favorite|null>} - Istanza `Favorite` rimossa o `null` se non trovata.
     */
    async removeFavorite(userid, insertionid) {

        const query = `
            DELETE FROM favorites
            WHERE userid = $1 AND insertionid = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [userid, insertionid]);
        return result.rows.length ? Favorite.fromDatabase(result.rows[0]) : null;
    }
}

module.exports = new FavoriteRepository();
