const { pool } = require('../config/db');

exports.findByEmail = async function (email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

exports.createUser = async function (email, hashedPassword, role, firstName, lastName, phone) {
  const query = `
    INSERT INTO users (email, password, role, first_name, last_name, phone)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, role, first_name, last_name, phone;
  `;
  const values = [email, hashedPassword, role, firstName, lastName, phone];
  const result = await pool.query(query, values);
  return result.rows[0];
};
