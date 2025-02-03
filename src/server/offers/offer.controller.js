
const offerRepository = require('../repositories/offer.repository');
const userRepository = require('../repositories/user.repository');

exports.offersByInsertionId = async (req, res) => {
    try {
        const { insertionId } = req.params;
        if (!insertionId) {
            return res.status(400).json({ message: 'Insertion ID è richiesto' });
        }

        const offers = await offerRepository.getOffersByInsertionId(insertionId);
        if (!offers || offers.length === 0) {
            return res.status(404).json({ message: 'Nessuna offerta trovata per questa inserzione.' });
        }

        res.status(200).json(offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createOffer = async (req, res) => {
    try {
        const { insertionId } = req.params;
        const { price } = req.body;
        const userId  = req.user.id;

        if (!insertionId || !price) {
            return res.status(400).json({ message: 'Insertion ID e price richiesti.' });
        }

        const user = await userRepository.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User non trovato' });
        }

        const offerAlreadyExist = await offerRepository.offerAlreadyExists(user, insertionId);
        if(offerAlreadyExist){
            return res.status(400).json({message: 'Offerta già in corso, non puoi inviare un ulteriore offerta.'})
        }

        const createdOffer = await offerRepository.createOffer(insertionId, price, user);
        res.status(201).json({ message: 'Offerta effettuata correttamente.', offer: createdOffer });
    } catch (error) {
        console.error('Errore creazione offerta:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getInsertionsWithOffer = async (req, res) => {
    try {
        const userId = req.user.id; 

        const insertionsWithOffers = await offerRepository.getInsertionsWithOfferForAnUser(userId);
  
        if ( !insertionsWithOffers || insertionsWithOffers.length === 0) {
            return res.status(404).json({ message: 'Non ci sono inserzioni per cui hai fatto offerte' });
        }
  
        res.status(200).json({offer: insertionsWithOffers});
  
    } catch (error) {
      console.error('Error fetching insertions with offer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.getAllOffersByInsertionId = async function (req, res) {
    try {
        const { insertionId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const user = await userRepository.findById(userId);

        if (!insertionId) {
            return res.status(400).json({ message: 'insertionId è richiesto' });
        }

        let receivedOffers;
        let sendedOffers;

        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            receivedOffers = await offerRepository.receveidOffersOfAnInsertionForAnAgent(user, insertionId);//Offerte ricevute per un agente
            sendedOffers = await offerRepository.sendedOffersOfAnInsertionForAnAgent(user, insertionId);//Offerte inviate di un agente
        } else {
            receivedOffers = await offerRepository.receveidOffersOfAnInsertionForAnUser(user, insertionId); //Offerte ricevute per un utente
            sendedOffers = await offerRepository.sendedOffersOfAnInsertionForAnUser(user, insertionId)//Offerte inviate di un utente
        }
  
        res.status(200).json({receivedOffers: receivedOffers, sendedOffers: sendedOffers});
    } catch (error) {
        console.error('Error fetching offers for insertionId:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };


exports.createManualOffer = async (req, res) => {
    try {
        const { insertionId, price, first_name, last_name } = req.body;
        const userId = req.user.id;

        if (!insertionId || !price) {
            return res.status(400).json({ message: 'Insertion ID e price richiesti.' });
        }

        const newManualOffer = {
            status: 'WAIT',
            userId,
            insertionId,
            firstName: first_name,
            lastName: last_name,
            price,
            createdAt: new Date(),
            updatedAt: null
        };

        const createdOffer = await offerRepository.createOffer(newManualOffer);

        res.status(201).json({ message: 'Offerta effettuata correttamente.', offer: createdOffer });
    } catch (error) {
        console.error('Errore creazione offerta:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


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
            // Trova l'utente per ottenere first_name e last_name
            const user = await userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Utente non trovato" });
            }
            offerResult = await offerRepository.counterofferByAgent(offerId, userId, newPrice);
        }

        console.log("Offerta Rifiutata/Controproposta:", offerResult);
        res.status(201).json({ message: 'Offerta rifiutata con controproposta.', offer: offerResult });

    } catch (error) {
        console.error('Errore rifiuto offerta:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.acceptOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let offerResult;

        if (userRole === "AGENT" || userRole === "MANAGER" || userRole === "ADMIN") {
            // Un agente accetta l'offerta dell'userRole
            offerResult = await offerRepository.acceptOfferByUser(offerId);
        } else {
            // Un utente accetta la controfferta dell'agente
            offerResult = await offerRepository.acceptOfferByAgent(offerId);
        }

        console.log("Offerta Accettata:", offerResult);
        res.status(201).json({ message: 'Offerta accettata con successo.', offer: offerResult });

    } catch (error) {
        console.error('Errore accettazione offerta:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};


exports.rejectOffer = async (req, res) => {
    try {
        const { offerId } = req.params;


        const offerResult = await offerRepository.rejectOffer(offerId);
        res.status(201).json({ message: 'Offerta rifiutata con successo.', offer: offerResult });
    } catch (error) {
        console.error('Errore rifiuto offerta:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};