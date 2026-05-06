const express = require('express');
const rutasFavoritas = require('../controllers/rutasFavoritasController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/rutaFav/:id', authMiddleware, rutasFavoritas.agregarRutaFav);
router.post('/rutaNoFav/:id', authMiddleware, rutasFavoritas.quitarRutaFav);
router.get('/rutasFav', authMiddleware, rutasFavoritas.rutasFav);

module.exports = router;
