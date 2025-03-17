const offerRepository = require('../repositories/offer.repository');
const userRepository = require('../repositories/user.repository');
const Offer = require('../models/Offer');
const Insertion = require('../models/Insertion');

/**
 * Recupera le inserzioni con offerte fatte da un utente.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.getInsertionsWithOffer = async (req, res) => {
    try {
        const userId = req.user.id;
        const insertionsWithOffers = await offerRepository.getInsertionsWithOfferForAnUser(userId);

        if (!insertionsWithOffers.length) {
            return res.status(404).json({ success: false, message: 'Non ci sono inserzioni per cui hai fatto offerte' });
        }

        return res.status(200).json({ success: true, data: insertionsWithOffers });
    } catch (error) {
        console.error('Error fetching insertions with offers:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Crea un'offerta manuale al di fuori del sistema.
 * 
 * Questa funzione permette a un utente di creare un'offerta manuale per un'inserzione specifica,
 * verificando che non esista già un'offerta per la stessa inserzione e utente.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
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

        const manualOfferAlreadyExists = await offerRepository.manualOfferAlreadyExists(userId, first_name, last_name, insertionId);
        if (manualOfferAlreadyExists) {
            return res.status(208).json({ success: false, message: 'Offerta già in corso, non puoi inviarne un\'altra.' });
        }

        const createdOffer = await offerRepository.createOffer(manualOffer);
        return res.status(201).json({ success: true, message: 'Offerta manuale creata con successo.', data: createdOffer.toJSON() });
    } catch (error) {
        console.error('Errore creazione offerta manuale:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Crea un'offerta per un'inserzione specifica.
 * 
 * Questa funzione crea un'offerta per un'inserzione specifica, verificando che l'utente non
 * abbia già fatto un'offerta per la stessa inserzione.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.createOffer = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const { price } = req.body;
        const userId = req.user.id;

        if (!insertionId || !price) {
            return res.status(400).json({ success: false, message: 'Insertion ID e price richiesti.' });
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        const offerAlreadyExists = await offerRepository.offerAlreadyExists(user, insertionId);
        if (offerAlreadyExists) {
            return res.status(208).json({ success: false, message: 'Offerta già in corso, non puoi inviarne un\'altra.' });
        }

        const newOffer = new Offer(
            null, 'WAIT', user.id, insertionId, new Date(), null, user.first_name, user.last_name, price, null
        );

        const createdOffer = await offerRepository.createOffer(newOffer);
        return res.status(201).json({ success: true, message: 'Offerta effettuata correttamente.', data: createdOffer.toJSON() });
    } catch (error) {
        console.error('Errore creazione offerta:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Effettua una controfferta per un'offerta esistente.
 * 
 * Questa funzione consente all'utente di fare una controfferta per un'offerta esistente,
 * verificando il ruolo dell'utente per determinare la modalità di gestione della controfferta.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.counteroffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const newPrice = req.body.price;

        let offerResult;
        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            offerResult = await offerRepository.counterofferByUser(offerId, newPrice);
        } else {
            //Gestione della controfferta per "USER"
            const user = await userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "Utente non trovato" });
            }
            offerResult = await offerRepository.counterofferByAgent(offerId, userId, newPrice);
        }

        return res.status(201).json({ success: true, message: 'Controfferta effettuata con successo.', data: offerResult.toJSON() });

    } catch (error) {
        console.error('Errore durante la controfferta:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Rifiuta un'offerta specifica.
 * 
 * Questa funzione consente di rifiutare un'offerta, cambiandone lo stato.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.rejectOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offerResult = await offerRepository.rejectOffer(offerId);

        return res.status(201).json({ success: true, message: 'Offerta rifiutata con successo.', data: offerResult.toJSON() });
    } catch (error) {
        console.error('Errore rifiuto offerta:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera tutte le offerte di una specifica inserzione.
 * 
 * Questa funzione recupera tutte le offerte relative a un'inserzione specifica, distinguendo
 * le offerte ricevute e quelle inviate in base al ruolo dell'utente.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.getAllOffersByInsertionId = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const user = await userRepository.findById(userId);
        

        if (!insertionId) {
            return res.status(400).json({ success: false, message: 'Insertion ID è richiesto' });
        }

        let receivedOffers, sentOffers;
        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            receivedOffers = await offerRepository.receivedOffersOfAnInsertionForAnAgent(user, insertionId);
            console.log("received:", receivedOffers);
            sentOffers = await offerRepository.sendedOffersOfAnInsertionForAnAgent(user, insertionId);
            console.log("sended:", sentOffers);
        } else {
            receivedOffers = await offerRepository.receveidOffersOfAnInsertionForAnUser(user, insertionId);
            sentOffers = await offerRepository.sendedOffersOfAnInsertionForAnUser(user, insertionId);
        }

        return res.status(200).json({ success: true, receivedOffers, sentOffers });

    } catch (error) {
        console.error('Error fetching offers for insertionId:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera la cronologia delle offerte su un'inserzione specifica.
 * 
 * Questa funzione restituisce tutte le offerte fatte su una specifica inserzione, mostrando
 * tutte le offerte effettuate nel tempo per quell'inserzione.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
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

        return res.status(200).json({ success: true, data: offers.map(offer => offer.toJSON()) });
    } catch (error) {
        console.error('Error fetching offers:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Accetta un'offerta specifica.
 * 
 * Questa funzione consente a un utente di accettare un'offerta, cambiando lo stato
 * dell'offerta in "accettata".
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
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

        return res.status(201).json({ success: true, message: 'Offerta accettata con successo.', data: offerResult.toJSON() });

    } catch (error) {
        console.error('Errore accettazione offerta:', error);
        return res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

/**
 * Recupera i dettagli della controfferta per una specifica offerta.
 * 
 * @param {Object} req - Oggetto della richiesta HTTP.
 * @param {Object} res - Oggetto della risposta HTTP.
 */
exports.getCounterOfferDetails = async (req, res) => {
    try {
      const { offerId } = req.params;
      console.log("sono nella funzione backend");
      const details = await offerRepository.getCounterOfferDetails(offerId);
  
      if (!details) {
        return res.status(404).json({ success: false, message: "Offerta originale non trovata" });
      }
      console.log("details backend", details);
      return res.status(200).json({ success: true, data: details });
    } catch (error) {
      console.error("Errore nel recupero dei dettagli della controfferta:", error);
      return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
  };