const { pool } = require('../config/db');


exports.findById = async function (id) {
    const query = `
      SELECT email, first_name, last_name, phone, id, password 
      FROM users 
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.findByEmail = async function (email) {
    const query = `
      SELECT email, first_name, last_name, phone, id 
      FROM users 
      WHERE email = $1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

exports.updateProfile = async function (id, hashedPassword, phone) {
    console.log(hashedPassword,phone);
    try{
        // Query SQL con COALESCE per mantenere i valori esistenti se non vengono aggiornati
        const query = `
        UPDATE users
        SET 
          password = COALESCE($2, password),
          phone = COALESCE($3, phone)
        WHERE id = $1
        RETURNING id, email, phone;`; // Non restituiamo più la password per sicurezza

        // Eseguiamo la query con i parametri
        const result = await pool.query(query, [id, hashedPassword, phone]);

        // Controlliamo se l'utente è stato aggiornato
        if (result.rows.length === 0) {
            throw new Error('Utente non trovato');
        }

        return result.rows[0]; // Ritorna i dati aggiornati dell'utente
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del profilo:', error.message);
        throw new Error('Errore interno del server');
    }
};

exports.getAllUsersProfile = async function () {
    const query = `SELECT * FROM users;`;
    const result = await pool.query(query);
    return result.rows;
};

exports.deleteProfileById = async function (id) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id, email, first_name, last_name, phone;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.checkValidateUpdatesAgent = async function (agentId) {
    const query = `SELECT supervisor, password FROM users WHERE id = $1;`;
    const result = await pool.query(query, [agentId]);
    return result.rows[0];
};

exports.getAgentsByManagerId = async function (id) {
    const query = 
        `SELECT id, email, first_name, last_name, phone 
        FROM users
        WHERE supervisor = $1`;
    const result = await pool.query(query, [id]);
    return result.rows; //Ritorna tutti gli elementi trovati
}

exports.createAgent = async function (first_name, last_name, email, password, phone, supervisorId, role) {
    const query = 
        `INSERT INTO users (first_name, last_name, email, password, phone, role, supervisor)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, first_name, last_name, email, phone, role, supervisor;`;
    const values = [first_name, last_name, email, password, phone, role, supervisorId];
    const result = await pool.query(query, values);
    return result.rows[0];
}


exports.findByGoogleId = async (googleId) => {
    const result = await pool.query('SELECT * FROM users WHERE googleId = $1', [googleId]);
    return result.rows[0];
};


exports.updateGoogleUser = async (id, fields) => {
    const { googleId } = fields;
    const result = await pool.query(
      `UPDATE users SET googleId = $1 WHERE id = $2 RETURNING *`,
      [googleId, id]
    );
    return result.rows[0];
};


exports.createGoogleUser = async (data) => {
    const { first_name, last_name, email, googleId, password, phone, role } = data;
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, googleId, password, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [first_name, last_name, email, googleId, password, phone, role]
    );
    return result.rows[0];
}