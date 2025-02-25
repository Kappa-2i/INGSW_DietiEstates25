class Offer {
    constructor(id, status, userid, insertionid, created_at, updated_at, first_name, last_name, price, parent_offer_id) {
        this.id = id;
        this.status = status;
        this.userid = userid;
        this.insertionid = insertionid;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.first_name = first_name;
        this.last_name = last_name;
        this.price = price;
        this.parent_offer_id = parent_offer_id;
    }

    /**
     * Crea un'istanza di `Offer` da un oggetto database.
     * @param {Object} data - Dati dal database.
     * @returns {Offer} - Istanza di `Offer`.
     */
    static fromDatabase(data) {
        return new Offer(
            data.id, data.status, data.userid, data.insertionid,
            data.created_at, data.updated_at, data.first_name, data.last_name,
            data.price, data.parent_offer_id
        );
    }

    /**
     * Converte l'oggetto `Offer` in JSON.
     * @returns {Object} - Dati pubblici dell'oggetto `Offer`.
     */
    toJSON() {
        return {
            id: this.id,
            status: this.status,
            userid: this.userid,
            insertionid: this.insertionid,
            created_at: this.created_at,
            updated_at: this.updated_at,
            first_name: this.first_name,
            last_name: this.last_name,
            price: this.price,
            parent_offer_id: this.parent_offer_id
        };
    }
}

module.exports = Offer;
