const express = require('express');
const perfilUsuarioController = require('../controllers/perfilUsuarioController')

const router = express.Router();

router.post('/modificarDatosUsuario', perfilUsuarioController.actualizar);

module.exports = router;