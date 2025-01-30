const { pool } = require('../config/db');

exports.getAllInsertions = async function () {
    const query = `SELECT * FROM insertions;`;
    const result = await pool.query(query);
    return result.rows;
};

exports.getLastInsertions = async function () {
    const query = `SELECT * FROM insertions ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
};

exports.getInsertionById = async function (id) {
    const query = `SELECT * FROM insertions WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows;
};

exports.deleteInsertionById = async function (id) {
    const query = `DELETE FROM insertions WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.getMyInsertions = async function (id) {
    const query = `SELECT * FROM insertions WHERE userid = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows;
};

exports.createInsertion = async (insertionData, imageUrls, userid) => {
    const {
        title, price, surface, room, bathroom, balcony, contract, region,
        municipality, cap, address, floor, energyclass, garage, garden,
        elevator, climate, terrace, reception
    } = insertionData;

    const query = `
        INSERT INTO insertions (
            title, price, surface, room, bathroom, balcony, contract, region, 
            municipality, cap, address, floor, energyclass, garage, garden, 
            elevator, climate, terrace, reception, userid, image_url, created_at
        ) 
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP
        ) 
        RETURNING *;
    `;

    const values = [
        title, price, surface, room, bathroom, balcony, contract, region,
        municipality, cap, address, floor, energyclass, garage, garden,
        elevator, climate, terrace, reception, userid, imageUrls
    ];

    const result = await pool.query(query, values);
    return result.rows[0]; // Restituisce l'inserzione creata
};

exports.addFavorite = async function (id, insertionId) {
    const query = `INSERT INTO favorites (userid, insertionid) 
                    VALUES ($1, $2) 
                    ON CONFLICT (userid, insertionid) DO NOTHING 
                    RETURNING *;`; //Prova per inserire un inserzione già esistente nei preferiti
                    
                    // INSERT INTO favorites IF NOT EXISTS (userid, insertionid) VALUES ($1, $2) RETURNING *
    const result = await pool.query(query, [id, insertionId]);
    return result.rows[0];
};

exports.getFavoritesByUser = async function (id) {
    const query = `SELECT 
                    i.*, 
                    u.first_name AS first_name, 
                    u.last_name AS last_name
                    FROM favorites f
                    JOIN insertions i ON f.insertionid = i.id
                    JOIN users u ON i.userid = u.id
                    WHERE f.userid = $1;
                    `;
    const result = await pool.query(query, [id]);
    return result.rows;
};

exports.getFilteredInsertions = async (filters) => {
    let query = `SELECT * FROM insertions WHERE 1=1`; // Inizializza la query con un filtro sempre vero
    let values = [];
    let index = 1;

    // Aggiunta dinamica dei filtri
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
    if (filters.balcony !== undefined) { // Booleano
        query += ` AND balcony = $${index}`;
        values.push(filters.balcony);
        index++;
    }
    if (filters.contract) {
        query += ` AND contract = $${index}`;
        values.push(filters.contract);
        index++;
    }
    if (filters.region) {
        query += ` AND region ILIKE $${index}`;
        values.push(`%${filters.region}%`); // Permette ricerche parziali (case insensitive)
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
    const booleanFields = ['garage', 'garden', 'elevator', 'climate', 'terrace', 'reception'];
    booleanFields.forEach(field => {
        if (filters[field] !== undefined) {
            query += ` AND ${field} = $${index}`;
            values.push(filters[field]);
            index++;
        }
    });

    query += ` ORDER BY created_at DESC`; // Ordina le inserzioni più recenti


    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Errore nella ricerca avanzata:", error.message);
        throw error;
    }
};
