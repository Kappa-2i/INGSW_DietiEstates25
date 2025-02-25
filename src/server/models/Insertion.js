class Insertion {
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
