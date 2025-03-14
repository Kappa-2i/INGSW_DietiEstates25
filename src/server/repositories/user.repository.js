const { pool } = require('../config/db');
const User = require('../models/User');

class UserRepository {
    /**
     * Recupera un utente in base al suo ID.
     * @param id - L'ID dell'utente da recuperare.
     * @returns {User|null} - L'utente trovato o null se non esiste.
    */
    async findById(id) {
        const query = `
            SELECT id, first_name, last_name, email, phone, password, role 
            FROM users 
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) return null;

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            result.rows[0].password,
            result.rows[0].role
        );
    }

    /**
     * Recupera un utente in base alla sua email.
     * @param email - L'email dell'utente da recuperare.
     * @returns {User|null} - L'utente trovato o null se non esiste.
    */
    async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, phone, password, role 
            FROM users 
            WHERE email = $1;
        `;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) return null;

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            result.rows[0].password,
            result.rows[0].role
        );
    }
    /**
     * Aggiorna il profilo di un utente, inclusa la password e il numero di telefono.
     * @param id - L'ID dell'utente da aggiornare.
     * @param hashedPassword - La nuova password dell'utente.
     * @param phone - Il nuovo numero di telefono dell'utente.
     * @returns {User} - L'utente aggiornato.
    */
    async updateProfile(id, hashedPassword, phone) {
            const query = `
                UPDATE users
                SET 
                    password = COALESCE($2, password),
                    phone = COALESCE($3, phone)
                WHERE id = $1
                RETURNING id, first_name, last_name, email, phone, role;
            `;
            const result = await pool.query(query, [id, hashedPassword, phone]);

            if (result.rows.length === 0) {
                throw new Error('Utente non trovato');
            }

            return new User(
                result.rows[0].id,
                result.rows[0].first_name,
                result.rows[0].last_name,
                result.rows[0].email,
                result.rows[0].phone,
                null, // Non restituiamo la password
                result.rows[0].role
            );
        
    }
    /**
     * Recupera tutti i profili degli utenti.
     * @returns {User[]} - Lista di tutti gli utenti.
    */
    async getAllUsersProfile() {
        const query = `SELECT id, first_name, last_name, email, phone, role FROM users;`;
        const result = await pool.query(query);

        return result.rows.map(row => new User(
            row.id,
            row.first_name,
            row.last_name,
            row.email,
            row.phone,
            null, // Evitiamo di esporre la password
            row.role
        ));
    }

    /**
     * Elimina un profilo utente in base all'ID.
     * @param id - L'ID dell'utente da eliminare.
     * @returns {User|null} - L'utente eliminato o null se non esiste.
    */
    async deleteProfileById(id) {
        const query = `
            DELETE FROM users 
            WHERE id = $1 
            RETURNING id, first_name, last_name, email, phone, role;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) return null;

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role
        );
    }

    /**
     * Recupera tutti gli agenti che lavorano sotto un manager specifico.
     * @param managerId - L'ID del manager di cui si vogliono recuperare gli agenti.
     * @returns {User[]} - Lista degli agenti.
    */
    async getAgentsByManagerId(managerId) {
        const query = `
            SELECT id, first_name, last_name, email, phone, role 
            FROM users 
            WHERE supervisor = $1;
        `;
        const result = await pool.query(query, [managerId]);

        return result.rows.map(row => new User(
            row.id,
            row.first_name,
            row.last_name,
            row.email,
            row.phone,
            null,
            row.role
        ));
    }

    /**
     * Crea un nuovo agente.
     * @param first_name - Il nome dell'agente.
     * @param last_name - Il cognome dell'agente.
     * @param email - L'email dell'agente.
     * @param password - La password dell'agente.
     * @param phone - Il numero di telefono dell'agente.
     * @param supervisorId - L'ID del supervisore dell'agente.
     * @param role - Il ruolo dell'agente.
     * @returns {User} - L'agente creato.
    */
    async createAgent(first_name, last_name, email, password, phone, supervisorId, role) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, phone, role, supervisor)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, first_name, last_name, email, phone, role, supervisor;
        `;
        const values = [first_name, last_name, email, password, phone, role, supervisorId];
        
        const result = await pool.query(query, values);
        

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role,
            result.rows[0].supervisor
        );
    }

    /**
     * Recupera un utente in base al suo Google ID.
     * @param googleId - L'ID Google dell'utente.
     * @returns {User|null} - L'utente trovato o null se non esiste.
    */
    async findByGoogleId(googleId) {
        const query = `SELECT id, first_name, last_name, email, phone, role FROM users WHERE googleId = $1;`;
        const result = await pool.query(query, [googleId]);

        if (result.rows.length === 0) return null;

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role
        );
    }

    /**
     * Aggiorna l'utente con il Google ID.
     * @param id - L'ID dell'utente da aggiornare.
     * @param googleId - Il nuovo Google ID dell'utente.
     * @returns {User|null} - L'utente aggiornato o null se non esiste.
    */
    async updateGoogleUser(id, googleId) {
        const query = `
            UPDATE users SET googleId = $1 
            WHERE id = $2 
            RETURNING id, first_name, last_name, email, phone, role;
        `;
        const result = await pool.query(query, [googleId, id]);

        if (result.rows.length === 0) return null;

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role
        );
    }

    /**
     * Crea un nuovo utente tramite Google.
     * @param data - I dati dell'utente (nome, cognome, email, Google ID, password, telefono, ruolo).
     * @returns {User} - L'utente creato.
    */
    async createGoogleUser(data) {
        const { first_name, last_name, email, googleId, password, phone, role } = data;
        console.log("Data:", data);
        const query = `
            INSERT INTO users (first_name, last_name, email, googleId, password, phone, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, first_name, last_name, email, phone, role;
        `;
        const values = [first_name, last_name, email, googleId, password, phone, role];
        const result = await pool.query(query, values);

        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role
        );
    }

    /**
     * Recupera un agente in base al suo ID.
     * @param agentId - L'ID dell'agente.
     * @returns {User} - L'agente trovato.
    */
    async getAgentById(agentId) {
        const query = `SELECT * FROM users WHERE id = $1;`;
        const result = await pool.query(query, [agentId]);
        
        return new User(
            result.rows[0].id,
            result.rows[0].first_name,
            result.rows[0].last_name,
            result.rows[0].email,
            result.rows[0].phone,
            null,
            result.rows[0].role
        );
    }

    /**
     * Controlla se esiste già un utente con una determinata email.
     * @param email - L'email da verificare.
     * @returns {User|null} - L'utente trovato o null se non esiste.
    */
    async emailAlreadyExists(email) {
        const query = 'SELECT * FROM users WHERE email = $1;'
        const result = await pool.query(query, [email]);
        console.log("res email:", result);


        return result.rows.length ? User.fromDatabase(result.rows[0]) : null;

    }
}

module.exports = new UserRepository();
