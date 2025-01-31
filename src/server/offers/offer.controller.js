
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
        const { insertionId, price } = req.body;
        const userId = req.user.id;

        if (!insertionId || !price) {
            return res.status(400).json({ message: 'Insertion ID e price richiesti.' });
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User non trovato' });
        }

        const newOffer = {
            status: 'WAIT',
            userId,
            insertionId,
            firstName: user.first_name,
            lastName: user.last_name,
            price,
            createdAt: new Date(),
            updatedAt: null
        };

        const createdOffer = await offerRepository.createOffer(newOffer);

        res.status(201).json({ message: 'Offerta effettuata correttamente.', offer: createdOffer });
    } catch (error) {
        console.error('Errore creazione offerta:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getInsertionsWithOffer = async (req, res) => {
    try {
        const userId = req.user.id; 
        const insertionsWithOffers = await offerRepository.getInsertionsWithOffer(userId);
  
        if ( !insertionsWithOffers || insertionsWithOffers.length === 0) {
            return res.status(404).json({ message: 'Non ci sono inserzioni per cui hai fatto offerte' });
        }
  
        res.status(200).json(insertionsWithOffers);
  
    } catch (error) {
      console.error('Error fetching insertions with offer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.getAllOffersByInsertionId = async function (req, res) {
    try {
        const { insertionId } = req.params;
        const userId = req.user.id;

        if (!insertionId) {
            return res.status(400).json({ message: 'insertionId è richiesto' });
        }

        const offers = await offerRepository.getAllOffersByInsertionId(insertionId, userId);
  
        if (!offers || offers.length === 0) {
            return res.status(404).json({ message: 'Nessuna offerta trovata per questa inserzione.' });
        }
      
        res.status(200).json(offers);
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