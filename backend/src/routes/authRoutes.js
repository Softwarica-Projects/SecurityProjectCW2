const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/change-password', authenticateToken, authController.changePassword);

router.get('/me', authenticateToken, authController.getMe);


module.exports = router;