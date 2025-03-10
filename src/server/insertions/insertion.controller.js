const axios = require('axios');
const insertionRepository = require('../repositories/insertion.repository');
const { uploadToS3 } = require('../middleware/upload.middleware');
const Insertion = require('../models/Insertion');

const API_KEY = "pVxzMB9ttWPE1wh_QsRBu1NTm0B65_okD3IoDD4vQ6M";

// Recupera tutte le inserzioni
exports.getAllInsertions = async (req, res) => {
    try {
        const allInsertions = await insertionRepository.getAllInsertions();
        if (!allInsertions.length) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione trovata' });
        }
        res.status(200).json({ success: true, data: allInsertions.map(insertion => insertion.toJSON()) });
    } catch (err) {
        console.error('Error fetching insertions:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Recupera le ultime inserzioni
exports.getLastInsertions = async (req, res) => {
    try {
        const lastInsertions = await insertionRepository.getLastInsertions();
        if (!lastInsertions.length) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione recente trovata' });
        }
        res.status(200).json({ success: true, data: lastInsertions.map(insertion => insertion.toJSON()) });
    } catch (err) {
        console.error('Error fetching last insertions:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Recupera un'inserzione specifica per ID
exports.getInsertionById = async (req, res) => {
    try {
        const { id } = req.params;
        const insertion = await insertionRepository.getInsertionById(id);
        if (!insertion) {
            return res.status(404).json({ success: false, message: 'Inserzione non trovata' });
        }
        res.status(200).json({ success: true, data: insertion.toJSON() });
    } catch (err) {
        console.error('Error fetching insertion by ID:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Elimina un'inserzione specifica per ID
exports.deleteInsertionById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInsertion = await insertionRepository.deleteInsertionById(id);
        if (!deletedInsertion) {
            return res.status(404).json({ success: false, message: 'Inserzione non eliminata o inesistente' });
        }
        res.status(200).json({ success: true, data: deletedInsertion.toJSON() });
    } catch (err) {
        console.error('Error deleting insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Recupera le inserzioni di un utente specifico
exports.getMyInsertions = async (req, res) => {
    try {
        const { id } = req.user;
        const insertions = await insertionRepository.getMyInsertions(id);
        if (!insertions.length) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione trovata per questo utente' });
        }
        res.status(200).json({ success: true, data: insertions.map(insertion => insertion.toJSON()) });
    } catch (err) {
        console.error('Error fetching user insertions:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Crea una nuova inserzione
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

        const location = await getCoordinates(req.body.address, req.body.cap, req.body.province, req.body.municipality, req.body.region);

        const newInsertion = await insertionRepository.createInsertion(req.body, imageUrls, userId, location);
        if (!newInsertion) {
            return res.status(500).json({ success: false, message: 'Errore durante la creazione dell\'inserzione' });
        }

        res.status(201).json({ success: true, data: newInsertion.toJSON() });
    } catch (err) {
        console.error('Error creating insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Recupera i punti di interesse vicini a una inserzione
exports.getPOIsForInsertion = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const category = req.query.category; // La categoria di POI da cercare

        // Recupera l'inserzione dal database
        const insertion = await insertionRepository.getInsertionById(insertionId);
        if (!insertion) {
            return res.status(404).json({ success: false, message: "Inserzione non trovata" });
        }

        // Recupera i POI vicini all'inserzione
        const pois = await getNearbyPOIs(insertion.latitude, insertion.longitude, category);

        res.status(200).json({ success: true, address: insertion.address, pois });
    } catch (error) {
        console.error("Errore nel recupero dei POI:", error);
        res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};

// Funzione per ottenere i POI vicini tramite API esterna
async function getNearbyPOIs(lat, lng, category) {
    const radius = 1000; // Raggio di ricerca in metri (1 km)
    const url = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=${category}&limit=10&radius=${radius}&apiKey=${API_KEY}`;
    

    try {
        const response = await axios.get(url);
        return response.data.items.map(place => ({
            name: place.title,
            category: place.categories?.[0]?.name || "Unknown",
            address: place.address?.label || "No address",
            distance: place.distance + "m",
            latitude: place.position?.lat || null,
            longitude: place.position?.lng || null
        }));
    } catch (error) {
        console.error("Errore nel recupero dei POI:", error);
        return [];
    }
}


// Recupera le inserzioni filtrate
exports.getFilteredInsertions = async (req, res) => {
    try {
        const filters = req.body;
        const insertions = await insertionRepository.getFilteredInsertions(filters);
        if (!insertions.length) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione trovata con questi filtri' });
        }
        res.status(200).json({ success: true, data: insertions.map(insertion => insertion.toJSON()) });
    } catch (error) {
        console.error("Errore nella ricerca avanzata:", error.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

// Funzione per ottenere coordinate geografiche
async function getCoordinates(address, cap, province, municipality, region) {
    const fullAddress = `${address}, ${cap}, ${municipality}, ${province}, ${region}`;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(fullAddress)}&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.items.length === 0) {
            throw new Error("Indirizzo non trovato.");
        }
        return response.data.items[0].position;
    } catch (error) {
        console.error("Errore nel geocoding:", error);
        return null;
    }
}
