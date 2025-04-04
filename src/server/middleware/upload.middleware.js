const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

//Client S3 di AWS configurato con le credenziali.
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

/*
  Configurazione di multer per caricare file in memoria.
  La memoria viene utilizzata per gestire i file temporaneamente prima di inviarli a S3.
 */
const storage = multer.memoryStorage();

/**
 * Middleware multer per la gestione dei file caricati.
 * - Impone un limite di 5MB per ogni file.
 * - Filtra i file per consentire solo immagini JPEG, JPG e PNG.
 */
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Tipo file non supportato'));
    }
}).array('images', 5);

/**
 * Funzione per caricare il file sul bucket S3 specificato.
 * - Genera un nome univoco per ogni file utilizzando un UUID.
 * 
 * @param {Object} file - Il file da caricare.
 * @returns {string|null} - L'URL del file caricato su S3, oppure null se non ci sono file.
 */
const uploadToS3 = async (file) => {
    if (!file) {
        console.error("Nessun file da caricare su S3!");
        return null;
    }

    const fileKey = `insertions/${crypto.randomUUID()}-${file.originalname}`;

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    
    return imageUrl;
};

module.exports = { upload, uploadToS3 };
