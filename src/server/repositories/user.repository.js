const { pool } = require('../config/db');
const User = require('../models/User');

class UserRepository {
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

    async emailAlreadyExists(email) {
        const query = 'SELECT * FROM users WHERE email = $1;'
        const result = await pool.query(query, [email]);
        console.log("res email:", result);


        return result.rows.length ? User.fromDatabase(result.rows[0]) : null;

    }
}

module.exports = new UserRepository();
