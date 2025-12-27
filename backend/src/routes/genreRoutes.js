const express = require('express');
const genreController = require('../controllers/genreController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', genreController.getGenres);

router.get('/:id', genreController.getGenreById);

router.post('/', authenticateToken, roleMiddleware('admin'), upload.single('image'), genreController.createGenre);

router.put('/:id', authenticateToken, roleMiddleware('admin'), upload.single('image'), genreController.updateGenre);

router.delete('/:id', authenticateToken, roleMiddleware('admin'), genreController.deleteGenre);

module.exports = router;