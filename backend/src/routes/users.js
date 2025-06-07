const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes in users router
router.use(authenticateToken);

router.get('/currentLogonUser', usersController.currentLogonUser); 
router.get('/', usersController.listUsers);
router.post('/', usersController.createUser);

router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;