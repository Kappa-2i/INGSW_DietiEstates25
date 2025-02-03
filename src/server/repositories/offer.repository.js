const { pool } = require('../config/db');

exports.getOffersByInsertionId = async function (insertionId) {

    const query = 'SELECT * FROM offers WHERE insertionid = $1;';
    const result = await pool.query(query, [insertionId]);
    return result.rows;

};

exports.createOffer = async function (insertionId, price, user) {
        console.log(insertionId);
        const query = `
            INSERT INTO offers (status, userid, insertionid, first_name, last_name, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            "WAIT",
            user.id,
            insertionId,
            user.first_name,
            user.last_name,
            price,
            new Date(),
            null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
};



exports.getInsertionsWithOfferForAnUser = async function (userId) {
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

exports.receveidOffersOfAnInsertionForAnAgent = async function (user, insertionId) {
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
    return result.rows;
};

exports.receveidOffersOfAnInsertionForAnUser = async function (user, insertionId) {
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
  return result.rows;
};

exports.sendedOffersOfAnInsertionForAnAgent = async function (user, insertionId) {
  const query = `
    SELECT *
    FROM offers
    WHERE insertionid = $1
    AND first_name = $2
    AND last_name = $3
    AND (status = 'COUNTEROFFER' OR status = 'ACCEPTED' OR status = 'REJECTED'); 
  `;
  const values = [insertionId, user.first_name, user.last_name];
  const result = await pool.query(query, values);
  return result.rows;
}

exports.sendedOffersOfAnInsertionForAnUser = async function (user, insertionId) {
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
  return result.rows;
}



exports.counterofferByUser = async function (offerId, newPrice) {
  const query = `
      WITH updated_offer AS (
          UPDATE offers
          SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING userid, insertionid, price
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
      RETURNING *;
  `;

  const values = [offerId, newPrice];
  console.log("Query:", query);
  console.log("Values:", values);

  const result = await pool.query(query, values);
  return result.rows[0]; // Restituisce la nuova offerta creata
};



    


  
exports.counterofferByAgent = async (offerId, userId, newPrice) => {
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
      RETURNING *;
  `;

  const values = [offerId, userId, newPrice];
  console.log("Query:", query);
  console.log("Values:", values);

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
      console.error("Errore: nessuna riga inserita in offers.");
      return null;
  }

  return result.rows[0]; // Restituisce la nuova offerta creata
};


exports.acceptOfferByUser = async function (offerId) {
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
};


exports.acceptOfferByAgent = async function (offerId) {
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
};


exports.rejectOffer = async function (offerId) {
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
  return result.rows[0]; // Restituisce la nuova offerta creata
};


exports.offerAlreadyExists = async function (user, insertionId) {
  const query = `
      SELECT * 
      FROM offers
      WHERE userid = $1 AND insertionid = $2;
  `;
  const values = [user.id, insertionId];
  const result = await pool.query(query, values);
  return result.rows;

};