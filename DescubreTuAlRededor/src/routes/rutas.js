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


router.get('/', rutasController.verRutasIndex);
router.get('/verRutas', rutasController.verRutas);
router.post('/anadirRuta', authMiddleware, rutasController.anadirRuta);
router.get('/detalleRuta/:id', authMiddleware, rutasController.detalleRuta);
router.get('/misRutas', authMiddleware, rutasController.misRutas);
router.get('/miRuta/:id', authMiddleware, rutasController.miRuta);
router.post('/editarRuta/:id', authMiddleware, rutasController.modificarRuta)


module.exports = router;