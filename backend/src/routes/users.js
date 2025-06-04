const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken); // Apply authentication middleware to all routes in this file

router.get('/', usersController.listUsers);         // GET /api/users
router.post('/', usersController.createUser);       // POST /api/users
router.put('/:id', usersController.updateUser);     // PUT /api/users/:id
router.delete('/:id', usersController.deleteUser);  // DELETE /api/users/:id


module.exports = router;