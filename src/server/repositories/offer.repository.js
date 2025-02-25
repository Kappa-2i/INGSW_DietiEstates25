const { pool } = require('../config/db');
const Offer = require('../models/Offer');

class OfferRepository {
    /**
     * Recupera tutte le offerte per una specifica inserzione.
     * @param {number} insertionId - ID dell'inserzione.
     * @returns {Promise<Offer[]>} - Lista delle offerte.
     */
    async getOffersByInsertionId(insertionId) {
        const query = 'SELECT * FROM offers WHERE insertionid = $1;';
        const result = await pool.query(query, [insertionId]);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Crea una nuova offerta per un'inserzione.
     * @param {number} insertionId - ID dell'inserzione.
     * @param {number} price - Prezzo offerto.
     * @param {Object} user - Utente che effettua l'offerta.
     * @returns {Promise<Offer>} - Offerta creata.
     */
    async createOffer(insertionId, price, user) {
        const query = `
            INSERT INTO offers (status, userid, insertionid, first_name, last_name, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)
            RETURNING *;
        `;

        const values = [
            "WAIT",
            user.id,
            insertionId,
            user.first_name,
            user.last_name,
            price,
            new Date()
        ];

        const result = await pool.query(query, values);
        return Offer.fromDatabase(result.rows[0]);
    }

    /**
     * Verifica se esiste già un'offerta attiva per una specifica inserzione.
     * @param {Object} user - Utente che fa l'offerta.
     * @param {number} insertionId - ID dell'inserzione.
     * @returns {Promise<boolean>} - `true` se esiste già un'offerta, `false` altrimenti.
     */
    async offerAlreadyExists(user, insertionId) {
        const query = `
            SELECT * 
            FROM offers
            WHERE userid = $1 AND insertionid = $2;
        `;
        const result = await pool.query(query, [user.id, insertionId]);
        return result.rows.length > 0;
    }

    /**
     * Accetta un'offerta, aggiornando il suo stato e cancellando le altre.
     * @param {number} offerId - ID dell'offerta da accettare.
     * @returns {Promise<Offer>} - Offerta accettata.
     */
    async acceptOffer(offerId) {
        const query = `
            UPDATE offers
            SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND status = 'WAIT'
            RETURNING *;
        `;
        const result = await pool.query(query, [offerId]);
        return Offer.fromDatabase(result.rows[0]);
    }
}

module.exports = new OfferRepository();
