const { pool } = require('../config/db');

exports.getOffersByInsertionId = async function (insertionId) {

    const query = 'SELECT * FROM offers WHERE insertionid = $1;';
    const result = await pool.query(query, [insertionId]);
    return result.rows;

};

exports.createOffer = async function (offer) {
        const query = `
            INSERT INTO offers (status, userid, insertionid, first_name, last_name, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            offer.status,
            offer.userId,
            offer.insertionId,
            offer.firstName,
            offer.lastName,
            offer.price,
            offer.createdAt,
            offer.updatedAt
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
};



exports.getInsertionsWithOffer = async function (userId) {
    const query = `
      SELECT
        insertions.*
      FROM
        insertions
      JOIN
        offers ON offers.insertionid = insertions.id
      WHERE
        offers.userid = $1;
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  };

exports.getAllOffersByInsertionId = async function (insertionId, userId) {
    const query = `
      SELECT
        first_name,
        last_name,
        price,
        status,
        created_at,
        updated_at
      FROM
        offers
      WHERE
        insertionid = $1 AND userid = $2;
    `;
    
    const result = await pool.query(query, [insertionId,userId]);
    return result.rows;
  };
  