const express = require('express');
const apuntarseQuedadaController = require('../controllers/apuntarseQuedadaController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/apuntarseQuedada/:id', authMiddleware, apuntarseQuedadaController.apuntarse);
router.post('/desapuntarseQuedada/:id', authMiddleware, apuntarseQuedadaController.desapuntarse);

module.exports = router;
