const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/currentLogonUser', usersController.currentLogonUser); // <-- Add this line
router.get('/', usersController.listUsers);
router.get('/:username', usersController.getUserByUsername);
router.post('/', usersController.createUser);

module.exports = router;