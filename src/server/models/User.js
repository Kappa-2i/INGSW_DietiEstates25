const bcrypt = require('bcryptjs');

class User {
    constructor(id, first_name, last_name, email, phone, password, role, supervisor = null, googleId = null) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.supervisor = supervisor;
        this.googleId = googleId;
    }

    /**
     * Verifica se la password in input corrisponde alla password hashata
     * @param {string} inputPassword - Password inserita dall'utente
     * @returns {Promise<boolean>} - True se la password è corretta, false altrimenti
     */
    async checkPassword(inputPassword) {
        return await bcrypt.compare(inputPassword, this.password);
    }

    /**
     * Hash della password prima di salvarla nel database
     * @param {string} plainPassword - Password in chiaro
     * @returns {Promise<string>} - Password hashata
     */
    static async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }

    /**
     * Converte l'oggetto User in JSON, escludendo dati sensibili come la password
     * @returns {Object} - Dati pubblici dell'utente
     */
    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone: this.phone,
            role: this.role,
            supervisor: this.supervisor,
            googleId: this.googleId
        };
    }

    /**
     * Crea un'istanza di User da un oggetto database
     * @param {Object} userData - Dati prelevati dal database
     * @returns {User} - Istanza della classe User
     */
    static fromDatabase(userData) {
        return new User(
            userData.id,
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.phone,
            userData.password,
            userData.role,
            userData.supervisor || null,
            userData.googleId || null
        );
    }
}

module.exports = User;
