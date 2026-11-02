const express = require('express');
const editarRutaAdminController = require('../controllers/editarRutaAdminController');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/editarRutaAdmin/:id', adminMiddleware, editarRutaAdminController.verFormularioEditarAdmin);
router.post('/editarRutaAdmin/:id', adminMiddleware, editarRutaAdminController.editarRutaAdmin);

module.exports = router;