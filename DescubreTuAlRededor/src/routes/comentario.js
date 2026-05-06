const express = require('express');
const comentarioController = require('../controllers/comentarioController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/fotosComentarios/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/comentario/:id', authMiddleware, upload.single('imagen'), comentarioController.anadirComentario);

module.exports = router;