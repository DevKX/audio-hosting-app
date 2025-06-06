const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', audioController.listAudio);

router.post('/', audioController.createAudio);

router.delete('/:id', audioController.deleteAudio);


module.exports = router;