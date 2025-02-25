class Favorite {
    constructor(userid, insertionid) {
        this.userid = userid;
        this.insertionid = insertionid;
    }

    /**
     * Crea un'istanza di `Favorite` da un oggetto database.
     * @param {Object} data - Dati dal database.
     * @returns {Favorite} - Istanza di `Favorite`.
     */
    static fromDatabase(data) {
        return new Favorite(data.userid, data.insertionid);
    }

    /**
     * Converte l'oggetto `Favorite` in JSON.
     * @returns {Object} - Dati pubblici dell'oggetto `Favorite`.
     */
    toJSON() {
        return {
            userid: this.userid,
            insertionid: this.insertionid
        };
    }
}

module.exports = Favorite;
