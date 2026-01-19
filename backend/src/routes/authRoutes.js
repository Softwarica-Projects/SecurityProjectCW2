const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.post('/register', authLimiter, authController.registerUser);

router.post('/login', authLimiter, authController.loginUser);

router.post('/change-password', authenticateToken, authLimiter, authController.changePassword);

router.get('/me', authenticateToken, authLimiter,authController.getMe);
router.get('/stats', authenticateToken, authLimiter,authController.getUserStats);
router.get('/favorites', authenticateToken, authLimiter,authController.getFavoriteMovies);
router.put('/update-profile', authenticateToken, authLimiter,authController.updateProfile);

module.exports = router;