const axios = require('axios');
const insertionRepository = require('../repositories/insertion.repository');
const { uploadToS3 } = require('../middleware/upload.middleware');
const Insertion = require('../models/Insertion');

const API_KEY = "pVxzMB9ttWPE1wh_QsRBu1NTm0B65_okD3IoDD4vQ6M";

/**
 * Recupera tutte le inserzioni.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con tutte le inserzioni o messaggio di errore.
 */
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

/**
 * Recupera le ultime inserzioni.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con le ultime inserzioni o messaggio di errore.
 */
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

/**
 * Recupera un'inserzione specifica per ID.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con l'inserzione richiesta o messaggio di errore.
 */
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

/**
 * Elimina un'inserzione specifica per ID.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con l'inserzione eliminata o messaggio di errore.
 */
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

/**
 * Recupera le inserzioni di un utente specifico.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con le inserzioni dell'utente o messaggio di errore.
 */
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

/**
 * Crea una nuova inserzione.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con la nuova inserzione creata o messaggio di errore.
 */
exports.createInsertion = async (req, res) => {
    try {
        const userId = req.user.id;
        let imageUrls;

        if (!req.files || req.files.length === 0) {
            //immagine di default
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

/**
 * Recupera i punti di interesse vicini a una inserzione.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con i POI vicini all'inserzione o messaggio di errore.
 */
exports.getPOIsForInsertion = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const category = req.query.category;

        const insertion = await insertionRepository.getInsertionById(insertionId);
        if (!insertion) {
            return res.status(404).json({ success: false, message: "Inserzione non trovata" });
        }

        const pois = await getNearbyPOIs(insertion.latitude, insertion.longitude, category);

        res.status(200).json({ success: true, address: insertion.address, pois });
    } catch (error) {
        console.error("Errore nel recupero dei POI:", error);
        res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};

/**
 * Funzione per ottenere i POI vicini tramite API esterna.
 * @param {number} lat - Latitudine dell'inserzione.
 * @param {number} lng - Longitudine dell'inserzione.
 * @param {string} category - Categoria dei POI da cercare.
 * @returns {Array} - POI vicini all'inserzione.
 */
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


/**
 * Recupera le inserzioni filtrate in base ai criteri selezionati.
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 * @returns {Object} - Risposta con le inserzioni filtrate o messaggio di errore.
 */
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

/**
 * Funzione per ottenere coordinate geografiche di un indirizzo tramite un'API esterna.
 * @param {string} address - Indirizzo della proprietà.
 * @param {string} cap - CAP della proprietà.
 * @param {string} province - Provincia della proprietà.
 * @param {string} municipality - Comune della proprietà.
 * @param {string} region - Regione della proprietà.
 * @returns {Object} - Coordinate geografiche dell'indirizzo.
 */
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
