const { pool } = require('../config/db');
const Insertion = require('../models/Insertion');

class InsertionRepository {

    /**
     * Recupera tutte le inserzioni dal database.
     * @returns {Promise<Insertion[]>} - Lista di tutte le inserzioni.
     */
    async getAllInsertions() {
        const query = `SELECT * FROM insertions;`;
        const result = await pool.query(query);
        return result.rows.map(row => Insertion.fromDatabase(row));
    }

    /**
     * Recupera le ultime inserzioni ordinate per data di creazione.
     * @returns {Promise<Insertion[]>} - Lista delle ultime inserzioni.
     */
    async getLastInsertions() {
        const query = `SELECT * FROM insertions
                        ORDER BY created_at DESC
                        LIMIT 12;`;
        const result = await pool.query(query);
        return result.rows.map(row => Insertion.fromDatabase(row));
    }

    /**
     * Recupera un'inserzione dal suo ID.
     * @param {number} id - ID dell'inserzione.
     * @returns {Promise<Insertion|null>} - Istanza dell'inserzione o null se non trovata.
     */
    async getInsertionById(id) {
        const query = `SELECT * FROM insertions WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows.length ? Insertion.fromDatabase(result.rows[0]) : null;
    }

    /**
     * Elimina un'inserzione dal suo ID.
     * @param {number} id - ID dell'inserzione da eliminare.
     * @returns {Promise<Insertion|null>} - Inserzione eliminata o null se non trovata.
     */
    async deleteInsertionById(id) {
        const query = `DELETE FROM insertions WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows.length ? Insertion.fromDatabase(result.rows[0]) : null;
    }

    /**
     * Recupera tutte le inserzioni di un utente specifico.
     * @param {number} userid - ID dell'utente.
     * @returns {Promise<Insertion[]>} - Lista delle inserzioni dell'utente.
     */
    async getMyInsertions(userid) {
        const query = `SELECT * FROM insertions WHERE userid = $1;`;
        const result = await pool.query(query, [userid]);
        return result.rows.map(row => Insertion.fromDatabase(row));
    }

    /**
     * Crea una nuova inserzione nel database.
     * @param {Object} insertionData - Dati dell'inserzione.
     * @param {string[]} imageUrls - URL delle immagini.
     * @param {number} userid - ID dell'utente che crea l'inserzione.
     * @param {Object} location - Latitudine e longitudine.
     * @returns {Promise<Insertion>} - Inserzione creata.
     */
    async createInsertion(insertionData, imageUrls, userid, location) {
        const {
            title, description, price, surface, room, bathroom, balcony, contract, region,
            province, municipality, cap, address, house_number, floor, energyclass, garage, garden,
            elevator, climate, terrace, reception
        } = insertionData;

        const query = `
            INSERT INTO insertions (
                title, description, price, surface, room, bathroom, balcony, contract, region, province,
                municipality, cap, address, house_number, floor, energyclass, garage, garden, 
                elevator, climate, terrace, reception, userid, image_url, created_at, latitude, longitude
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22, $23, $24, CURRENT_TIMESTAMP, $25, $26
            ) 
            RETURNING *;
        `;

        const values = [
            title, description, price, surface, room, bathroom, balcony, contract, region, province,
            municipality, cap, address, house_number, floor, energyclass, garage, garden,
            elevator, climate, terrace, reception, userid, imageUrls, location.lat, location.lng
        ];

        const result = await pool.query(query, values);
        return Insertion.fromDatabase(result.rows[0]);
    }

    /**
     * Recupera le inserzioni filtrate in base ai parametri passati.
     * @param {Object} filters - Filtri di ricerca.
     * @returns {Promise<Insertion[]>} - Lista delle inserzioni filtrate.
     */
    async getFilteredInsertions(filters) {
        let query = `SELECT * FROM insertions WHERE 1=1`;
        let values = [];
        let index = 1;

        if (filters.price) {
            query += ` AND price <= $${index}`;
            values.push(filters.price);
            index++;
        }
        if (filters.surface) {
            query += ` AND surface >= $${index}`;
            values.push(filters.surface);
            index++;
        }
        if (filters.room) {
            query += ` AND room >= $${index}`;
            values.push(filters.room);
            index++;
        }
        if (filters.bathroom) {
            query += ` AND bathroom >= $${index}`;
            values.push(filters.bathroom);
            index++;
        }
        if (filters.contract) {
            query += ` AND contract = $${index}`;
            values.push(filters.contract);
            index++;
        }
        if (filters.region) {
            query += ` AND region ILIKE $${index}`;
            values.push(`%${filters.region}%`);
            index++;
        }
        if (filters.province) {
            query += ` AND province ILIKE $${index}`;
            values.push(`%${filters.province}%`);
            index++;
        }
        if (filters.municipality) {
            query += ` AND municipality ILIKE $${index}`;
            values.push(`%${filters.municipality}%`);
            index++;
        }
        if (filters.floor) {
            query += ` AND floor = $${index}`;
            values.push(filters.floor);
            index++;
        }
        if (filters.energyclass) {
            query += ` AND energyclass = $${index}`;
            values.push(filters.energyclass);
            index++;
        }

        // Filtri booleani per caratteristiche opzionali
        ['garage', 'garden', 'elevator', 'climate', 'terrace', 'reception'].forEach(field => {
            if (filters[field] !== undefined) {
                query += ` AND ${field} = $${index}`;
                values.push(filters[field]);
                index++;
            }
        });

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, values);
        return result.rows.map(row => Insertion.fromDatabase(row));
    }
}

module.exports = new InsertionRepository();
