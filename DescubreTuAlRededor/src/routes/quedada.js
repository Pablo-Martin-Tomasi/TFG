const express = require('express');
const multer = require('multer');
const path = require('path');
const quedadasController = require('../controllers/quedadaController');
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


router.post('/organizarQuedada/:id', authMiddleware, quedadasController.organizarQuedada);
router.get('/verQuedadas', quedadasController.verQuedadas);
router.get('/detalleQuedada/:id', authMiddleware, quedadasController.detalleQuedada);
router.get('/quedadasOrganizadas', authMiddleware, quedadasController.quedadasOrganizadas);
router.get('/quedadasApuntado', authMiddleware, quedadasController.quedadasApuntado);

module.exports = router;