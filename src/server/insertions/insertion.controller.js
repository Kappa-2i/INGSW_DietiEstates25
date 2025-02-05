const axios = require('axios');
const insertionRepository = require('../repositories/insertion.repository');
const { uploadToS3 } = require('../middleware/upload.middleware');

const API_KEY = "pVxzMB9ttWPE1wh_QsRBu1NTm0B65_okD3IoDD4vQ6M";

exports.getAllInsertions = async (req, res) => {
    try {
        const allInsertions = await insertionRepository.getAllInsertions();
        if (!allInsertions) {
            return res.status(404).json({ status:404, success: false, message: 'Inserzioni non trovate' });
        }

        res.status(200).json({ status: 200, success: true, data: allInsertions});
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getLastInsertions = async (req, res) => {
    try {
        const lastInsertions = await insertionRepository.getLastInsertions();
        if (!lastInsertions) {
            return res.status(404).json({ status: 404, success: false, message: 'Ultime inserzioni non trovate' });
        }

        res.status(200).json({ status: 200, success: true, data: lastInsertions});
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getInsertionById = async (req, res) => {
    try {
        const { id } = req.params;

        const insertionById = await insertionRepository.getInsertionById(id);
        if (!insertionById) {
            return res.status(404).json({ status: 404, success: false, message: 'Inserzione non trovata' });
        }
        
        res.status(200).json({ status: 200, success: true, data: insertionById});
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.deleteInsertionById = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;

        const deletedInsertion = await insertionRepository.deleteInsertionById(id);
        if (!deletedInsertion) {
            return res.status(404).json({ status: 404, success: false, message: 'Inserzione non eliminata' });
        }

        res.status(200).json({ status: 200, success: true, data: deletedInsertion});
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getMyInsertions = async (req, res) => {
    try {
        const { id } = req.user;
        
        const insertionsByAgentId = await insertionRepository.getMyInsertions(id);
        if (!insertionsByAgentId) {
            return res.status(404).json({ status: 404, success: false, message: 'Inserzioni non trovate' });
        }

        res.status(200).json({ status: 200, success: true, data: insertionsByAgentId});
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.createInsertion = async (req, res) => {
    try {
        const userId = req.user.id;
        let imageUrls;
        if (!req.files || req.files.length === 0) {
            imageUrls = ["https://properties25-images.s3.us-east-1.amazonaws.com/insertions/defaulthouse.jpg"];
        } else {
            const uploadPromises = req.files.map(file => uploadToS3(file));
            imageUrls = await Promise.all(uploadPromises);
        }


        const location = await getCoordinates(req.body.address, req.body.cap, req.body.municipality, req.body.municipality);
        console.log(location.lat);
        // Creazione inserzione con immagini
        const newInsertion = await insertionRepository.createInsertion(req.body, imageUrls, userId, location);
        if(!newInsertion){
            res.status(500).json({ status:500, success: false, message: 'Inserzione non creata' });
        }

        res.status(201).json({ status:201, success: true, data: newInsertion });

    } catch (err) {
        console.error('Error creating insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

async function getCoordinates(address, cap, municipality, region) {
    // Costruzione dell'indirizzo completo includendo il CAP, città e regione
    const fullAddress = `${address}, ${cap}, ${municipality}, ${region}`;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(fullAddress)}&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.items.length === 0) {
            throw new Error("Indirizzo non trovato.");
        }

        const location = response.data.items[0].position;
        console.log(`Coordinate trovate: Lat ${location.lat}, Lng ${location.lng}`);
        return location;
    } catch (error) {
        console.error("Errore nel geocoding:", error);
        return null;
    }
}


exports.addFavorite = async (req, res) => {
    try {
        const { id } = req.user;
        const { insertionId } = req.params;

        const addFavorite = await insertionRepository.addFavorite(id, insertionId);
        if(!addFavorite){
            res.status(500).json({ status:500, success: false, message: 'Inserzione non aggiunta ai preferiti' });
        }

        res.status(201).json({ status:201, success: true, data: addFavorite });

    } catch (err) {
        console.error('Error creating insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};


exports.getFavoritesByUser = async (req, res) => {
    try {
        const { id } = req.user;
        
        const myFavorites = await insertionRepository.getFavoritesByUser(id);
        if(!myFavorites){
            res.status(500).json({ status:500, success: false, message: 'Favoriti non presenti' });
        }

        res.status(201).json({ status:201, success: true, data: myFavorites });

    } catch (err) {
        console.error('Error creating insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

exports.getFilteredInsertions = async (req, res) => {
    try {
        const filters = req.body;
        console.log("Filtri ricevuti dal body:", filters);

        const insertions = await insertionRepository.getFilteredInsertions(filters);

        if (insertions.length === 0) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione trovata con questi filtri' });
        }

        res.status(200).json({ success: true, data: insertions });
    } catch (error) {
        console.error("Errore nella ricerca avanzata:", error.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};



// Funzione per ottenere i POI vicini
async function getNearbyPOIs(lat, lng, category) {
    const radius = 1000; // Raggio di ricerca in metri (1 km)
    const url = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=${category}&limit=10&apiKey=${API_KEY}`;

    const response = await axios.get(url);
    console.log(response);
    return response.data.items.map(place => ({
        name: place.title,
        category: place.categories?.[0]?.name || "Unknown",
        address: place.address?.label || "No address",
        distance: place.distance + "m",
        latitude: place.position?.lat || null,   // Latitudine del POI
        longitude: place.position?.lng || null 
    }));
}

// Endpoint per ottenere i POI vicino a una specifica inserzione
exports.getPOIsForInsertion = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const category = req.query.category;
        console.log(insertionId, typeof insertionId, category, typeof category);

        
        const insertion = await insertionRepository.getInsertionById(insertionId);
        console.log(insertion.latitude, insertion.longitude);
        const pois = await getNearbyPOIs(insertion.latitude, insertion.longitude, category);

        res.status(200).json({ address: insertion.address, pois: pois });
    } catch (error) {
        console.error("Errore nel recupero dei POI:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
};