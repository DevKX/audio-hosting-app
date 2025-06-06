const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/currentLogonUser', usersController.currentLogonUser); 
router.get('/', usersController.listUsers);
router.get('/:id', usersController.getUserByUsername);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);

module.exports = router;