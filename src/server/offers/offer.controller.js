const offerRepository = require('../repositories/offer.repository');
const userRepository = require('../repositories/user.repository');
const Offer = require('../models/Offer');

/**
 * Recupera le inserzioni con offerte fatte da un utente.
 */
exports.getInsertionsWithOffer = async (req, res) => {
    try {
        const userId = req.user.id;
        const insertionsWithOffers = await offerRepository.getInsertionsWithOfferForAnUser(userId);

        if (!insertionsWithOffers.length) {
            return res.status(404).json({ success: false, message: 'Non ci sono inserzioni per cui hai fatto offerte' });
        }

        res.status(200).json({ success: true, data: insertionsWithOffers });
    } catch (error) {
        console.error('Error fetching insertions with offers:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Crea un'offerta manuale al di fuori del sistema.
 */
exports.createManualOffer = async (req, res) => {
    try {
        const { insertionId, price, first_name, last_name } = req.body;
        const userId = req.user.id;

        if (!insertionId || !price) {
            return res.status(400).json({ success: false, message: 'Insertion ID e price richiesti.' });
        }

        const manualOffer = new Offer(
            null, 'WAIT', userId, insertionId, new Date(), null, first_name, last_name, price, null
        );

        const createdOffer = await offerRepository.createOffer(manualOffer);
        res.status(201).json({ success: true, message: 'Offerta manuale creata con successo.', data: createdOffer.toJSON() });
    } catch (error) {
        console.error('Errore creazione offerta manuale:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Crea un'offerta per un'inserzione specifica.
 */
exports.createOffer = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const { price } = req.body;
        const userId = req.user.id;
        console.log(insertionId, price, userId);
        if (!insertionId || !price) {
            return res.status(400).json({ success: false, message: 'Insertion ID e price richiesti.' });
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        const offerAlreadyExists = await offerRepository.offerAlreadyExists(user, insertionId);
        if (offerAlreadyExists) {
            return res.status(400).json({ success: false, message: 'Offerta già in corso, non puoi inviarne un\'altra.' });
        }

        const newOffer = new Offer(
            null, 'WAIT', user.id, insertionId, new Date(), null, user.first_name, user.last_name, price, null
        );
        console.log("NEW OFFER:", newOffer);
        const createdOffer = await offerRepository.createOffer(newOffer);
        res.status(201).json({ success: true, message: 'Offerta effettuata correttamente.', data: createdOffer.toJSON() });
    } catch (error) {
        console.error('Errore creazione offerta:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Effettua una controfferta per un'offerta esistente.
 */
exports.counteroffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const newPrice = req.body.price;
        console.log("COUNTeROFFER:", offerId, userId, userRole, newPrice);
        let offerResult;
        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            offerResult = await offerRepository.counterofferByUser(offerId, newPrice);
        } else {
            const user = await userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "Utente non trovato" });
            }
            offerResult = await offerRepository.counterofferByAgent(offerId, userId, newPrice);
        }

        res.status(201).json({ success: true, message: 'Controfferta effettuata con successo.', data: offerResult.toJSON() });

    } catch (error) {
        console.error('Errore durante la controfferta:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Rifiuta un'offerta specifica.
 */
exports.rejectOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offerResult = await offerRepository.rejectOffer(offerId);

        res.status(201).json({ success: true, message: 'Offerta rifiutata con successo.', data: offerResult.toJSON() });
    } catch (error) {
        console.error('Errore rifiuto offerta:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera tutte le offerte di una specifica inserzione.
 */
exports.getAllOffersByInsertionId = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const user = await userRepository.findById(userId);
        console.log("getAllOffersByInsertionId",insertionId, userRole, userId);
        if (!insertionId) {
            return res.status(400).json({ success: false, message: 'Insertion ID è richiesto' });
        }

        let receivedOffers, sentOffers;
        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            receivedOffers = await offerRepository.receivedOffersOfAnInsertionForAnAgent(user, insertionId);
            sentOffers = await offerRepository.sendedOffersOfAnInsertionForAnAgent(user, insertionId);
        } else {
            receivedOffers = await offerRepository.receveidOffersOfAnInsertionForAnUser(user, insertionId);
            sentOffers = await offerRepository.sendedOffersOfAnInsertionForAnUser(user, insertionId);
        }

        res.status(200).json({ success: true, receivedOffers, sentOffers });

    } catch (error) {
        console.error('Error fetching offers for insertionId:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera la cronologia delle offerte su un'inserzione specifica.
 */
exports.offersByInsertionId = async (req, res) => {
    try {
        const { insertionId } = req.params;
        if (!insertionId) {
            return res.status(400).json({ success: false, message: 'Insertion ID è richiesto' });
        }

        const offers = await offerRepository.getOffersByInsertionId(insertionId);
        if (!offers.length) {
            return res.status(404).json({ success: false, message: 'Nessuna offerta trovata per questa inserzione.' });
        }

        res.status(200).json({ success: true, data: offers.map(offer => offer.toJSON()) });
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Accetta un'offerta specifica.
 */
exports.acceptOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const userRole = req.user.role;

        let offerResult;
        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            offerResult = await offerRepository.acceptOfferByUser(offerId);
        } else {
            offerResult = await offerRepository.acceptOfferByAgent(offerId);
        }

        res.status(201).json({ success: true, message: 'Offerta accettata con successo.', data: offerResult.toJSON() });

    } catch (error) {
        console.error('Errore accettazione offerta:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};
