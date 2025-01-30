const { pool } = require('../config/db');


exports.findById = async function (id) {
    const query = `
      SELECT email, first_name, last_name, phone 
      FROM users 
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.updateProfile = async function (id, password, phone) {
    const query = 
    `UPDATE users
    SET 
      password = COALESCE($2, password),
      phone = COALESCE($3, phone)
    WHERE id = $1
    RETURNING id, email, phone, password;`;
    const result = await pool.query(query, [id, password, phone]);
    return result.rows[0];
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