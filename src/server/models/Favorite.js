class Favorite {
    /**
     * Costruttore per l'oggetto Favorite.
     * @param userid - ID dell'utente che ha aggiunto il preferito.
     * @param insertionid - ID dell'inserzione aggiunta ai preferiti.
     * @returns {Favorite} - Ritorna una nuova istanza di `Favorite`.
    */
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
