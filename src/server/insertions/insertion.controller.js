const bcrypt = require('bcryptjs');
const insertionRepositories = require('../repositories/insertion.repositories');
const { uploadToS3 } = require('../middleware/upload.middleware');

exports.getAllInsertions = async (req, res) => {
    try {
        const allInsertions = await insertionRepositories.getAllInsertions();
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
        const lastInsertions = await insertionRepositories.getLastInsertions();
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


        const insertionById = await insertionRepositories.getInsertionById(id);
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

        const deletedInsertion = await insertionRepositories.deleteInsertionById(id);
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

        const insertionsByAgentId = await insertionRepositories.getMyInsertions(id);
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
        const { id } = req.user;
        let imageUrls;
        if (!req.files || req.files.length === 0) {
            imageUrls = ["https://your-s3-bucket.s3.region.amazonaws.com/default-image.jpg"];
        } else {
            const uploadPromises = req.files.map(file => uploadToS3(file));
            imageUrls = await Promise.all(uploadPromises);
        }
        // Creazione inserzione con immagini
        const newInsertion = await insertionRepositories.createInsertion(req.body, imageUrls, id);
        if(!newInsertion){
            res.status(500).json({ status:500, success: false, message: 'Inserzione non creata' });
        }

        res.status(201).json({ status:201, success: true, data: newInsertion });

    } catch (err) {
        console.error('Error creating insertion:', err.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};


exports.addFavorite = async (req, res) => {
    try {
        const { id } = req.user;
        const { insertionId } = req.params;

        const addFavorite = await insertionRepositories.addFavorite(id, insertionId);
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
        
        const myFavorites = await insertionRepositories.getFavoritesByUser(id);
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

        const insertions = await insertionRepositories.getFilteredInsertions(filters);

        if (insertions.length === 0) {
            return res.status(404).json({ success: false, message: 'Nessuna inserzione trovata con questi filtri' });
        }

        res.status(200).json({ success: true, data: insertions });
    } catch (error) {
        console.error("Errore nella ricerca avanzata:", error.message);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

