const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const upload = multer(); 

router.use(authenticateToken); // Apply authentication middleware to all routes in this file

router.post('/', upload.single('file'), uploadController.uploadAudio);

router.delete('/:filename', uploadController.deleteAudio);

module.exports = router;