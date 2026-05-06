const express = require('express');
const GPSController = require('../controllers/rutasGPSController')
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/vistaGPS', authMiddleware, GPSController.verGPS);

module.exports = router;