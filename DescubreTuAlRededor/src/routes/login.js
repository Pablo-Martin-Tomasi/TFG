const express = require('express');
const LoginController = require('../controllers/LoginController')

const router = express.Router();

router.get('/login', LoginController.login)
router.post('/login', LoginController.aut)

router.get('/register', LoginController.register)
router.post('/register', LoginController.storeUser)

router.get('/logout', LoginController.logout)

module.exports = router;


