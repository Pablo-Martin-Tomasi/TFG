const express = require('express');
const perfilUsuarioController = require('../controllers/perfilUsuarioController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/modificarDatosUsuario', authMiddleware, perfilUsuarioController.actualizar);
router.post('/modificarContrasenia', authMiddleware, perfilUsuarioController.cambiarContrasenia);
router.post('/cambiarFotoPerfil', authMiddleware, upload.single('imagen'), perfilUsuarioController.cambiarFotoPerfil);

module.exports = router;