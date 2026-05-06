const express = require('express');
const multer = require('multer');
const path = require('path');
const imagesRutaController = require('../controllers/imagesRutaController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/fotosRuta/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const upload = multer({ storage });

router.get('/ruta/:id/anadirImagenRuta', authMiddleware, imagesRutaController.verFormularioAnadirImagen);
router.post('/ruta/:id/anadirImagenRuta', authMiddleware, upload.array('imagenesRuta', 6), imagesRutaController.anadirImagenRuta)

module.exports = router;