const Movie = require('../models/movieModel');
const User = require('../models/userModel');
const Genre = require('../models/genreModel');

class GeneralController {
    async getSummary(req, res) {
        try {
            const totalMovies = await Movie.countDocuments();
            const totalUsers = await User.countDocuments({ role: 'user' });
            const totalAdmins = await User.countDocuments({ role: 'admin' });
            const totalGenres = await Genre.countDocuments();

            const movies = await Movie.find();
            let topViewedMovie = null;
            let maxViews = 0;
            movies.forEach(movie => {
                if (movie.views > maxViews) {
                    maxViews = movie.views;
                    topViewedMovie = movie.title;
                }
            });

            res.status(200).json({
                totalMovies,
                totalUsers,
                totalAdmins,
                totalGenres,
                topViewedMovie: topViewedMovie || null
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = GeneralController;