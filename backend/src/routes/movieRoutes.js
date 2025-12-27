const express = require('express');
const movieController = require('../controllers/movieController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const optionalAuthenticateToken = require('../middlewares/optionalAuthMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', movieController.getMovies); 

router.get('/:id/detail', optionalAuthenticateToken, movieController.getMovieById);

router.post('/', authenticateToken, roleMiddleware('admin'), upload.single('coverImage'), movieController.createMovie);

router.put('/:id', authenticateToken, roleMiddleware('admin'), upload.single('coverImage'), movieController.updateMovie);

router.delete('/:id', authenticateToken, roleMiddleware('admin'), movieController.deleteMovie);

router.post('/:movieId/rate', authenticateToken, movieController.rateMovie);

router.post('/:movieId/view', authenticateToken, movieController.viewMovie);

router.post('/:movieId/checkout', authenticateToken, movieController.createCheckoutSession);

router.get('/:movieId/is-purchased', authenticateToken, movieController.checkPurchaseStatus);

router.get('/:movieId/verify-transaction', authenticateToken, movieController.verifyTransaction);

router.get('/transactions/list', authenticateToken, movieController.getTransactions);

router.get('/featured-movies', movieController.getFeaturedMovies);

router.get('/recent', movieController.getRecentlyAddedMovies);

router.get('/top-viewed', movieController.getTopViewedMovies);

router.get('/soon-releasing', movieController.getSoonReleasingMovies);

router.patch('/:movieId/featured', authenticateToken, roleMiddleware('admin'), movieController.toggleFeatured);

router.post('/:movieId/toggle-favorites', authenticateToken, movieController.toggleFavorite);

router.get('/search', movieController.searchMovies);

module.exports = router;