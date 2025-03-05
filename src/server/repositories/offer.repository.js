const { pool } = require('../config/db');
const Insertion = require('../models/Insertion');
const Offer = require('../models/Offer');

class OfferRepository {
    
    /**
     * Recupera tutte le offerte per una specifica inserzione.
     * @param {number} insertionId - L'ID dell'inserzione.
     * @returns {Promise<Offer[]>} - Lista delle offerte.
     */
    async getOffersByInsertionId(insertionId) {
        const query = 'SELECT * FROM offers WHERE insertionid = $1 ORDER BY created_at DESC;';
        const result = await pool.query(query, [insertionId]);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Crea una nuova offerta.
     * @param {Offer} offer - L'oggetto offerta da creare.
     * @returns {Promise<Offer>} - L'offerta creata.
     */
    async createOffer(offer) {
        console.log("Offer Rep:", offer);
        const query = `
            INSERT INTO offers (status, userid, insertionid, first_name, last_name, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            offer.status,
            offer.userid,
            offer.insertionid,
            offer.first_name,
            offer.last_name,
            offer.price,
            offer.created_at,
            offer.updated_at
        ];

        const result = await pool.query(query, values);
        return Offer.fromDatabase(result.rows[0]);
    }

    /**
     * Controlla se un'utente ha già un'offerta attiva su un'inserzione.
     * @param {Object} user - L'utente che effettua l'offerta.
     * @param {number} insertionId - L'ID dell'inserzione.
     * @returns {Promise<boolean>} - True se l'offerta esiste già, altrimenti false.
     */
    async offerAlreadyExists(user, insertionId) {
        const query = `SELECT * FROM offers WHERE userid = $1 AND insertionid = $2;`;
        const values = [user.id, insertionId];
        const result = await pool.query(query, values);
        return result.rows.length > 0;
    }

    /**
     * Recupera le inserzioni su cui un utente ha fatto offerte.
     * @param {number} userId - L'ID dell'utente.
     * @returns {Insertion<Object[]>} - Lista delle inserzioni con offerte.
     */
    async getInsertionsWithOfferForAnUser(userId) {
        const query = `
            SELECT insertions.*
            FROM insertions
            JOIN offers ON offers.insertionid = insertions.id
            WHERE offers.userid = $1;
        `;

        const result = await pool.query(query, [userId]);
        return result.rows.map(row => Insertion.fromDatabase(row));
    }

    /**
     * Recupera le offerte ricevute da un agente su una specifica inserzione.
     */
    async receivedOffersOfAnInsertionForAnAgent(user, insertionId) {
        const query = `
        SELECT o.*
        FROM offers o
        JOIN insertions i ON o.insertionid = i.id
        WHERE i.userid = $1
        AND o.insertionid = $2
        AND o.first_name <> $3
        AND o.last_name <> $4
        AND (o.status = 'WAIT' OR o.status = 'ACCEPTED' OR o.status = 'REJECTED');
        `;

        const values = [user.id, insertionId, user.first_name, user.last_name];
        const result = await pool.query(query, values);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Recupera le offerte ricevute da un utente su una specifica inserzione.
     */
    async receveidOffersOfAnInsertionForAnUser(user, insertionId) {
        const query = `
        SELECT *
        FROM offers
        WHERE userid = $1
        AND insertionid = $2
        AND first_name <> $3
        AND last_name <> $4
        AND (status = 'COUNTEROFFER' OR status = 'REJECTED' OR status = 'ACCEPTED') ORDER BY updated_at DESC; 
        `;

        const values = [user.id, insertionId, user.first_name, user.last_name];
        const result = await pool.query(query, values);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Recupera le offerte inviate da un agente per una specifica inserzione.
     */
    async sendedOffersOfAnInsertionForAnAgent(user, insertionId) {
        const query = `
            SELECT * FROM offers
            WHERE insertionid = $1
            AND first_name = $2
            AND last_name = $3
            AND (status = 'COUNTEROFFER' OR status = 'ACCEPTED' OR status = 'REJECTED');
        `;

        const values = [insertionId, user.first_name, user.last_name];
        const result = await pool.query(query, values);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Recupera le offerte inviate da un utente per una specifica inserzione.
     */
    async sendedOffersOfAnInsertionForAnUser(user, insertionId) {
        const query = `
        SELECT *
        FROM offers
        WHERE userid = $1 
        AND insertionid = $2
        AND first_name = $3
        AND last_name = $4
        AND (status = 'WAIT' OR status = 'ACCEPTED' OR status = 'REJECTED');
        `;

        const values = [user.id, insertionId, user.first_name, user.last_name];
        const result = await pool.query(query, values);
        return result.rows.map(row => Offer.fromDatabase(row));
    }

    /**
     * Effettua una controfferta per un utente.
     */
    async counterofferByUser(offerId, newPrice) {
        console.log("counterByUser:", offerId, newPrice);
        const query = `
            WITH updated_offer AS (
                UPDATE offers
                SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
                WHERE id = $1 AND status = 'WAIT'  -- Verifica che l'offerta sia in stato "WAIT"
                RETURNING userid, insertionid
            )
            INSERT INTO offers (status, userid, insertionid, price, parent_offer_id, created_at, updated_at, first_name, last_name)
            SELECT 
                'COUNTEROFFER', 
                o.userid,  
                o.insertionid, 
                $2, 
                $1,  
                CURRENT_TIMESTAMP, 
                CURRENT_TIMESTAMP,
                u.first_name,  
                u.last_name
            FROM updated_offer o
            JOIN insertions i ON o.insertionid = i.id
            JOIN users u ON i.userid = u.id  
            RETURNING *;`;
    
        const values = [offerId, newPrice];
        const result = await pool.query(query, values);
    
        //Gestiamo il caso in cui nessuna riga sia stata inserita
        if (!result.rows.length) {
            console.error("Errore: la controfferta non è stata creata.");
            return null;  // Oppure lanciare un errore: throw new Error("Counteroffer creation failed")
        }
    
        console.log("RESULT di counterOfferByUser:", result.rows[0]);
        return Offer.fromDatabase(result.rows[0]);
    }
    
    async acceptOfferByUser(offerId) {
        const query = `
            WITH accepted_offer AS (
                UPDATE offers
                SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP
                WHERE id = $1 AND status = 'WAIT'
                RETURNING insertionid
            )
            DELETE FROM offers
            WHERE insertionid = (SELECT insertionid FROM accepted_offer) AND id <> $1
            RETURNING *;
        `;
    
        const values = [offerId];
        console.log("Query:", query);
        console.log("Values:", values);
    
        const result = await pool.query(query, values);
        
        return result.rows;
    }
    
    async acceptOfferByAgent(offerId) {
        const query = `
            WITH accepted_offer AS (
                UPDATE offers
                SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP
                WHERE id = $1 AND status = 'COUNTEROFFER'
                RETURNING insertionid
            )
            DELETE FROM offers
            WHERE insertionid = (SELECT insertionid FROM accepted_offer) AND id <> $1
            RETURNING *;
        `;
    
        const values = [offerId];
        console.log("Query:", query);
        console.log("Values:", values);
    
        const result = await pool.query(query, values);
        
        return result.rows;
    }
    

    /**
     * Rifiuta un'offerta.
     */
    async rejectOffer(offerId) {
        const query = `
            WITH rejected_offer AS (
                UPDATE offers
                SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
                WHERE id = $1 AND status = 'WAIT'
                RETURNING insertionid
            )
            DELETE FROM offers
            WHERE insertionid = (SELECT insertionid FROM rejected_offer) AND id <> $1
            RETURNING *;`;

        const result = await pool.query(query, [offerId]);
        return Offer.fromDatabase(result.rows[0]);
    }

    /**
 * Effettua una controfferta da parte di un agente.
 * @param {number} offerId - L'ID dell'offerta originale.
 * @param {number} userId - L'ID dell'agente che effettua la controfferta.
 * @param {number} newPrice - Il nuovo prezzo della controfferta.
 * @returns {Promise<Offer>} - La nuova controfferta creata.
 */
async counterofferByAgent(offerId, userId, newPrice) {
    const query = `
        WITH updated_offer AS (
            UPDATE offers
            SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING userid, insertionid, price
        )
        INSERT INTO offers (status, userid, insertionid, price, parent_offer_id, created_at, updated_at, first_name, last_name)
        SELECT 
            'WAIT', 
            $2, 
            o.insertionid, 
            $3, 
            $1,  
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP,
            u.first_name,
            u.last_name
        FROM updated_offer o
        JOIN users u ON u.id = $2
        RETURNING *;`;

    const values = [offerId, userId, newPrice];
    console.log("Query:", query);
    console.log("Values:", values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        console.error("Errore: nessuna riga inserita in offers.");
        return null;
    }

    return Offer.fromDatabase(result.rows[0]);
}

}

module.exports = new OfferRepository();
