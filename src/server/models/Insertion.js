class Insertion {

    /**
     * Costruttore per l'oggetto Insertion.
     *
     * @param id - ID univoco dell'inserzione.
     * @param title - Titolo dell'inserzione.
     * @param description - Descrizione dell'inserzione.
     * @param room - Numero di stanze.
     * @param bathroom - Numero di bagni.
     * @param balcony - Numero di balconi.
     * @param contract - Tipo di contratto ("BUY" o "RENT").
     * @param region - Regione in cui si trova l'immobile.
     * @param province - Provincia dell'immobile.
     * @param municipality - Comune dell'immobile.
     * @param cap - CAP dell'immobile.
     * @param address - Indirizzo completo dell'immobile.
     * @param house_number - Numero civico dell'immobile.
     * @param floor - Piano in cui si trova l'immobile.
     * @param energyclass - Classe energetica dell'immobile.
     * @param garage - Se l'immobile ha un garage.
     * @param garden - Se l'immobile ha un giardino.
     * @param elevator - Se l'immobile è dotato di ascensore.
     * @param climate - Tipo di riscaldamento/clima.
     * @param terrace - Se l'immobile ha una terrazza.
     * @param reception - Se l'immobile ha una reception.
     * @param userid - ID dell'utente che ha creato l'inserzione.
     * @param image_url - URL dell'immagine principale dell'inserzione.
     * @param created_at - Data di creazione dell'inserzione.
     * @param updated_at - Data dell'ultima modifica dell'inserzione.
     * @param surface - Superficie dell'immobile in metri quadrati.
     * @param price - Prezzo dell'immobile.
     * @param latitude - Latitudine dell'immobile.
     * @param longitude - Longitudine dell'immobile.
     * @returns {Insertion} - Ritorna una nuova istanza di Insertion.
     */
    constructor(
        id, title, description, room, bathroom, balcony, contract, region, province, municipality, cap, address,
        house_number ,floor, energyclass, garage, garden, elevator, climate, terrace, reception, userid,
        image_url, created_at, updated_at, surface, price, latitude, longitude
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.room = room;
        this.bathroom = bathroom;
        this.balcony = balcony;
        this.contract = contract;
        this.region = region;
        this.municipality = municipality;
        this.province = province;
        this.cap = cap;
        this.address = address;
        this.house_number = house_number;
        this.floor = floor;
        this.energyclass = energyclass;
        this.garage = garage;
        this.garden = garden;
        this.elevator = elevator;
        this.climate = climate;
        this.terrace = terrace;
        this.reception = reception;
        this.userid = userid;
        this.image_url = image_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.surface = surface;
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     * Converte un oggetto database in un'istanza di Insertion
     * @param {Object} data - Dati dell'inserzione dal database
     * @returns {Insertion} - Istanza della classe Insertion
     */
    static fromDatabase(data) {
        return new Insertion(
            data.id, data.title, data.description, data.room, data.bathroom, data.balcony, data.contract,
            data.region, data.province, data.municipality, data.cap, data.address, data.house_number, data.floor, data.energyclass,
            data.garage, data.garden, data.elevator, data.climate, data.terrace, data.reception,
            data.userid, data.image_url, data.created_at, data.updated_at, data.surface,
            data.price, data.latitude, data.longitude
        );
    }

    /**
     * Restituisce una rappresentazione JSON dell'inserzione
     * @returns {Object} - Dati pubblici dell'inserzione
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            room: this.room,
            bathroom: this.bathroom,
            balcony: this.balcony,
            contract: this.contract,
            region: this.region,
            province: this.province,
            municipality: this.municipality,
            cap: this.cap,
            address: this.address,
            house_number: this.house_number,
            floor: this.floor,
            energyclass: this.energyclass,
            garage: this.garage,
            garden: this.garden,
            elevator: this.elevator,
            climate: this.climate,
            terrace: this.terrace,
            reception: this.reception,
            userid: this.userid,
            image_url: this.image_url,
            created_at: this.created_at,
            updated_at: this.updated_at,
            surface: this.surface,
            price: this.price,
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }
}

module.exports = Insertion;
