const { pool } = require('../config/db');

/**
  * Trova un utente nel database tramite email.
  * @param email - L'email dell'utente da cercare.
  * @returns {Promise<Object|null>} - L'oggetto utente se esiste, altrimenti null.
*/
exports.findByEmail = async function (email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

/**
  *Crea un nuovo utente nel database.
  @param email - L'email del nuovo utente.
  @param hashedPassword - La password dell'utente, già hashata.
  @param role - Il ruolo dell'utente.
  @param firstName - Il nome dell'utente.
  @param lastName - Il cognome dell'utente.
  @param phone - Il numero di telefono dell'utente.
  @returns {Promise} - L'oggetto utente appena creato.
*/
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
