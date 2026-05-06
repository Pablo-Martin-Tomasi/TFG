const express = require('express');
const historialRutasController = require('../controllers/historialRutasController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/rutaHecha/:id', authMiddleware, historialRutasController.rutaHecha);
router.get('/historialRutas', authMiddleware, historialRutasController.historialDeRutas);

module.exports = router;
