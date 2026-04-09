const express = require('express');
const multer = require('multer');
const path = require('path');
const rutasController = require('../controllers/rutasController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/mapasRutas/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });


router.get('/verRutas', rutasController.verRutas);
router.post('/anadirRuta', authMiddleware, upload.single('mapaDeLaRuta'), rutasController.anadirRuta);
router.get('/detalleRuta/:id', rutasController.detalleRuta);

module.exports = router;