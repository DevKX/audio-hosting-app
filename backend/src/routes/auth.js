const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//No authMiddleware needed here because this route is for login and to get a token
// It should be accessible without authentication
router.post('/login', authController.login);

module.exports = router;