const MovieService = require('../services/MovieService');
const { NotFoundException } = require('../exceptions');
const PaymentService = require('../services/PaymentService');

class MovieController {
    constructor() {
        this.movieService = new MovieService();
        this.paymentService=new PaymentService();
    }

    async createMovie(req, res, next) {
        try {
            const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.movieService.createMovie(req.body, coverImagePath);
            res.status(201).json({
                success: true,
                message: 'Movie created successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMovie(req, res, next) {
        try {
            const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.movieService.updateMovie(req.params.id, req.body, coverImagePath);

            res.status(200).json({
                success: true,
                message: 'Movie updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const userId = req.user ? req.user.id : null;
            const movies = await this.movieService.getMovies(basePath, userId, req);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getMovieById(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const userId = req.user ? req.user.id : null;
            const movie = await this.movieService.getMovieById(req.params.id, basePath, userId);
            res.status(200).json(movie);
        } catch (error) {
            next(error);
        }
    }

    async deleteMovie(req, res, next) {
        try {
            const result = await this.movieService.deleteMovie(req.params.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async rateMovie(req, res, next) {
        try {
            const result = await this.movieService.addRating(req.params.movieId, req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async viewMovie(req, res, next) {
        try {
            const result = await this.movieService.incrementMovieView(req.params.movieId, req.user.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleFeatured(req, res, next) {
        try {
            const movieId = req.params.movieId;
            const movie = await this.movieService.movieRepository.findById(movieId);
            if (!movie) {
                throw new NotFoundException('Movie', movieId);
            }

            const updatedMovie = await this.movieService.movieRepository.updateById(movieId, {
                featured: !movie.featured
            });

            res.status(200).json({
                success: true,
                message: `Movie ${updatedMovie.featured ? 'marked as featured' : 'removed from featured'}`,
            });
        } catch (error) {
            next(error);
        }
    }

    async getFeaturedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getFeaturedMovies(basePath, req);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getRecentlyAddedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getRecentMovies(5, basePath, req);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getTopViewedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getMostViewedMovies(5, basePath, req);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getSoonReleasingMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const currentDate = new Date();
            const formattedMovies = await this.movieService.getSoonReleasingMovies(basePath, req);

            res.status(200).json(formattedMovies);
        } catch (error) {
            next(error);
        }
    }

    async toggleFavorite(req, res, next) {
        try {
            const AuthService = require('../services/AuthService');
            const authService = new AuthService();
            const { movieId } = req.params;
            const userId = req.user.id;

            const user = await authService.userRepository.findById(userId);
            const isFavorite = user.favourites.includes(movieId);

            if (isFavorite) {
                await authService.removeFromFavorites(userId, movieId);
                res.status(200).json({
                    success: true,
                    message: 'Movie removed from favorites'
                });
            } else {
                await authService.addToFavorites(userId, movieId);
                res.status(200).json({
                    success: true,
                    message: 'Movie added to favorites'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async createCheckoutSession(req, res, next) {
        try {
            const { movieId } = req.params;
            const userId = req.user && req.user.id;
            if (!movieId) return res.status(400).json({ success: false, message: 'movieId is required in path' });
            if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
            const PaymentService = require('../services/PaymentService');
            const paymentService = new PaymentService();

            const successUrl = process.env.STRIPE_SUCCESS_URL || `${req.protocol}://${req.get('host')}/payment-success`;
            const cancelUrl = process.env.STRIPE_CANCEL_URL || `${req.protocol}://${req.get('host')}/payment-cancel`;

            const { session } = await paymentService.createCheckoutSession({ movieId, userId, successUrl, cancelUrl });
            res.status(200).json({ success: true, sessionId: session.id, url: session.url });
        } catch (error) {
            next(error);
        }
    }

    async createTransactionFromSession(req, res, next) {
        try {
            const { sessionId } = req.body;
            if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId is required' });

            const PaymentService = require('../services/PaymentService');
            const paymentService = new PaymentService();

            const transaction = await paymentService.createTransactionFromSession(sessionId);
            res.status(201).json({ success: true, transaction });
        } catch (error) {
            next(error);
        }
    }

    async checkPurchaseStatus(req, res, next) {
        try {
            const { movieId } = req.params;
            const userId = req.user.id;
            const TransactionRepository = require('../repositories/TransactionRepository');
            const tr = new TransactionRepository();
            const records = await tr.find({ userId, movieId, status: 'paid' });
            res.status(200).json({ success: true, purchased: records && records.length > 0 });
        } catch (error) {
            next(error);
        }
    }

    async verifyTransaction(req, res, next) {
        try {
            const { movieId } = req.params;
            // accept several possible session id param names
            const sessionId = req.query.session_id || req.query.sessionId || req.query.stripeSessionId || req.query.stripe_session_id;
            const userId = req.user && req.user.id;
            if (!sessionId) {
                return res.status(400).json({ success: false, message: 'stripe session id (session_id or stripeSessionId) is required' });
            }
            const transaction = await this.paymentService.verifyTransaction(movieId, sessionId, userId);
            return res.status(200).json({ success: true, transaction });
        } catch (error) {
             res.status(400).json({ success: false, message: error.message });
        }
    }

    async getTransactions(req, res, next) {
        try {
            const userId = req.user.id;
            const TransactionRepository = require('../repositories/TransactionRepository');
            const tr = new TransactionRepository();
            const items = await tr.findByUser(userId);
            res.status(200).json({ success: true, transactions: items });
        } catch (error) {
            next(error);
        }
    }

    async searchMovies(req, res, next) {
        try {
            const { query, genreId, sortBy, orderBy } = req.query;
            const basePath = `${req.protocol}://${req.get('host')}`;
            const userId = req.user ? req.user.id : null;
            const movies = await this.movieService.searchMovies(query, genreId, sortBy, orderBy, basePath, userId, req);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }
}

const movieController = new MovieController();

module.exports = {
    createMovie: movieController.createMovie.bind(movieController),
    updateMovie: movieController.updateMovie.bind(movieController),
    getMovies: movieController.getMovies.bind(movieController),
    getMovieById: movieController.getMovieById.bind(movieController),
    deleteMovie: movieController.deleteMovie.bind(movieController),
    rateMovie: movieController.rateMovie.bind(movieController),
    viewMovie: movieController.viewMovie.bind(movieController),
    toggleFeatured: movieController.toggleFeatured.bind(movieController),
    getFeaturedMovies: movieController.getFeaturedMovies.bind(movieController),
    getRecentlyAddedMovies: movieController.getRecentlyAddedMovies.bind(movieController),
    getTopViewedMovies: movieController.getTopViewedMovies.bind(movieController),
    getSoonReleasingMovies: movieController.getSoonReleasingMovies.bind(movieController),
    toggleFavorite: movieController.toggleFavorite.bind(movieController),
    createCheckoutSession: movieController.createCheckoutSession.bind(movieController),
    checkPurchaseStatus: movieController.checkPurchaseStatus.bind(movieController),
    getTransactions: movieController.getTransactions.bind(movieController),
    searchMovies: movieController.searchMovies.bind(movieController),
    verifyTransaction:movieController.verifyTransaction.bind(movieController),
};