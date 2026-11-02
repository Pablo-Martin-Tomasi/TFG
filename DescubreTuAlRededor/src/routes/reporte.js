const express = require('express');
const multer = require('multer');
const path = require('path');
const reporteController = require('../controllers/reporteController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();


router.get('/reportarRuta/:id', authMiddleware, reporteController.verFormularioReporte);
router.post('/reportarRuta/:id', authMiddleware, reporteController.hacerReporte);

router.get('/verRutasConReportes', adminMiddleware, reporteController.verRutasReportadas);
router.get('/detalleReporte/:id', adminMiddleware, reporteController.verReportesRuta);

module.exports = router;