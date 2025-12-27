const MovieRepository = require('../repositories/MovieRepository');
const GenreRepository = require('../repositories/GenreRepository');
const TransactionRepository = require('../repositories/TransactionRepository');
const { ValidationException, NotFoundException, ConflictException } = require('../exceptions');
const mongoose = require('mongoose');

class MovieService {
    constructor() {
        this.movieRepository = new MovieRepository();
        this.genreRepository = new GenreRepository();
        this.transactionRepository = new TransactionRepository();
    }

    validateMovieData(movieData) {
        const { title, description, releaseDate, genre, runtime, movieType } = movieData;

        if (!title || title.trim().length < 1) {
            throw new ValidationException('Movie title is required', 'title');
        }

        if (!description || description.trim().length < 10) {
            throw new ValidationException('Movie description must be at least 10 characters long', 'description');
        }

        if (!releaseDate) {
            throw new ValidationException('Release date is required', 'releaseDate');
        }

        if (!genre) {
            throw new ValidationException('Genre is required', 'genre');
        }

        if (!mongoose.Types.ObjectId.isValid(genre)) {
            throw new ValidationException('Invalid genre ID', 'genre');
        }

        if (!runtime || runtime < 1) {
            throw new ValidationException('Runtime must be a positive number', 'runtime');
        }

        if (!movieType || !['movie', 'series'].includes(movieType)) {
            throw new ValidationException('Movie type must be either "movie" or "series"', 'movieType');
        }

        if (movieData.cast) {
            const cast = Array.isArray(movieData.cast) ? movieData.cast : JSON.parse(movieData.cast);
            if (!Array.isArray(cast)) {
                throw new ValidationException('Cast must be an array', 'cast');
            }

            cast.forEach((member, index) => {
                if (!member.name || member.name.trim().length < 1) {
                    throw new ValidationException(`Cast member ${index + 1} name is required`, 'cast');
                }
                if (!member.type || member.type.trim().length < 1) {
                    throw new ValidationException(`Cast member ${index + 1} type is required`, 'cast');
                }
            });
        }

        if (movieData.trailerLink && !this.isValidUrl(movieData.trailerLink)) {
            throw new ValidationException('Invalid trailer link URL', 'trailerLink');
        }

        if (movieData.movieLink && !this.isValidUrl(movieData.movieLink)) {
            throw new ValidationException('Invalid movie link URL', 'movieLink');
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async createMovie(movieData, coverImagePath = null) {
        this.validateMovieData(movieData);

        const genre = await this.genreRepository.findById(movieData.genre);
        if (!genre) {
            throw new NotFoundException('Genre', movieData.genre);
        }

        let cast = movieData.cast;
        if (typeof cast === 'string') {
            cast = JSON.parse(cast);
        }

        const movieToCreate = {
            title: movieData.title.trim(),
            description: movieData.description.trim(),
            releaseDate: new Date(movieData.releaseDate),
            genre: movieData.genre,
            trailerLink: movieData.trailerLink || null,
            movieLink: movieData.movieLink || null,
            cast: cast || [],
            runtime: movieData.runtime,
            movieType: movieData.movieType,
            coverImage: coverImagePath
        };

        const movie = await this.movieRepository.create(movieToCreate);
        return movie;
    }

    async updateMovie(movieId, movieData, coverImagePath = null) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        const existingMovie = await this.movieRepository.findById(movieId);
        if (!existingMovie) {
            throw new NotFoundException('Movie', movieId);
        }

        this.validateMovieData(movieData);

        const genre = await this.genreRepository.findById(movieData.genre);
        if (!genre) {
            throw new NotFoundException('Genre', movieData.genre);
        }

        let cast = movieData.cast;
        if (typeof cast === 'string') {
            cast = JSON.parse(cast);
        }

        const updateData = {
            title: movieData.title.trim(),
            description: movieData.description.trim(),
            releaseDate: new Date(movieData.releaseDate),
            genre: movieData.genre,
            trailerLink: movieData.trailerLink || null,
            movieLink: movieData.movieLink || null,
            cast: cast || [],
            runtime: movieData.runtime,
            movieType: movieData.movieType
        };

        if (coverImagePath) {
            updateData.coverImage = coverImagePath;
        }

        const movie = await this.movieRepository.updateById(movieId, updateData);
        return movie;
    }

    async getMovies(basePath, userId = null, req = null) {
        const movies = await this.movieRepository.findWithGenre();
        return this.formatMoviesWithBasePath(movies, basePath, userId, req);
    }

    async getMovieById(movieId, basePath, userId = null, req = null) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        const movie = await this.movieRepository.findByIdWithGenreAndRatings(movieId);
        if (!movie) {
            throw new NotFoundException('Movie', movieId);
        }

        const formattedMovie = await this.formatMovieWithBasePath(movie, basePath, userId, req);

        if (userId) {
            const UserRepository = require('../repositories/UserRepository');
            const userRepository = new UserRepository();
            const user = await userRepository.findById(userId);
            formattedMovie.isFavourite = user ? user.favourites.includes(movieId) : false;
        } else {
            formattedMovie.isFavourite = false;
        }

        return formattedMovie;
    }

    async deleteMovie(movieId) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        const movie = await this.movieRepository.deleteById(movieId);
        if (!movie) {
            throw new NotFoundException('Movie', movieId);
        }

        return { message: 'Movie deleted successfully' };
    }

    async getMoviesByGenre(genreId, basePath, req = null) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new ValidationException('Invalid genre ID', 'genreId');
        }

        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
            throw new NotFoundException('Genre', genreId);
        }

        const movies = await this.movieRepository.findByGenre(genreId);
        return this.formatMoviesWithBasePath(movies, basePath, null, req);
    }

    async getFeaturedMovies(basePath, req = null) {
        const movies = await this.movieRepository.findFeaturedMovies();
        return this.formatMoviesWithBasePath(movies, basePath, null, req);
    }

    async searchMovies(searchTerm, genreId, sortBy, orderBy, basePath, userId = null, req = null) {
 
        if (genreId) {
            const genre = await this.genreRepository.findById(genreId);
            if (!genre) {
                throw new NotFoundException('Genre', genreId);
            }
        }
        const validSortFields = ['rating', 'views', 'name', 'releasedate', 'featured'];
        if (sortBy && !validSortFields.includes(sortBy.toLowerCase())) {
            throw new ValidationException('Invalid sortBy parameter. Valid options: rating, views, name, release date, featured', 'sortBy');
        }

        const validOrderOptions = ['asc', 'desc'];
        if (orderBy && !validOrderOptions.includes(orderBy.toLowerCase())) {
            throw new ValidationException('Invalid orderBy parameter. Valid options: asc, desc', 'orderBy');
        }

        const movies = await this.movieRepository.advancedSearchMovies(
            searchTerm,
            genreId,
            sortBy,
            orderBy
        );
        
        return this.formatMoviesWithBasePath(movies, basePath, userId, req);
    }

    async addRating(movieId, userId, ratingData) {
        const { rating, review } = ratingData;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        if (!rating || rating < 1 || rating > 5) {
            throw new ValidationException('Rating must be between 1 and 5', 'rating');
        }

        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new NotFoundException('Movie', movieId);
        }

        const existingRating = movie.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            await this.movieRepository.updateRating(movieId, userId, rating, review || '');
        } else {
            await this.movieRepository.addRating(movieId, userId, rating, review || '');
        }

        await this.movieRepository.updateAverageRating(movieId);

        return { message: 'Rating added successfully' };
    }

    async incrementMovieView(movieId, userId) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new NotFoundException('Movie', movieId);
        }
        await this.movieRepository.incrementView(movieId, userId);

        return { message: 'View recorded successfully' };
    }

    async getMoviesByType(movieType, basePath) {
        if (!movieType || !['movie', 'series'].includes(movieType)) {
            throw new ValidationException('Movie type must be either "movie" or "series"', 'movieType');
        }

        const movies = await this.movieRepository.findByMovieType(movieType);
        return this.formatMoviesWithBasePath(movies, basePath);
    }

    async getRecentMovies(limit, basePath, req = null) {
        const movies = await this.movieRepository.findRecentMovies(limit);
        return this.formatMoviesWithBasePath(movies, basePath, null, req);
    }

    async getTopRatedMovies(limit, basePath, req = null) {
        const movies = await this.movieRepository.findTopRatedMovies(limit);
        return this.formatMoviesWithBasePath(movies, basePath, null, req);
    }

    async getMostViewedMovies(limit, basePath, req = null) {
        const movies = await this.movieRepository.findMostViewedMovies(limit);
        return this.formatMoviesWithBasePath(movies, basePath, null, req);
    }

    async getSoonReleasingMovies(basePath, req = null) {
        const currentDate = new Date();
        const movies = await this.movieRepository.find(
            { releaseDate: { $gt: currentDate } },
            'genre',
            { releaseDate: 1 }
        );
        const limitedMovies = movies.slice(0, 5);
        return this.formatMoviesWithBasePath(limitedMovies, basePath, null, req);
    }

    async toggleFeaturedStatus(movieId) {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new ValidationException('Invalid movie ID', 'movieId');
        }

        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new NotFoundException('Movie', movieId);
        }

        const updatedMovie = await this.movieRepository.updateById(movieId, {
            featured: !movie.featured
        });

        return {
            message: `Movie ${updatedMovie.featured ? 'marked as featured' : 'removed from featured'}`,
            movie: updatedMovie
        };
    }

    formatMoviesWithBasePath(movies, basePath, userId = null, req = null) {
        return Promise.all(movies.map(async movie => this.formatMovieWithBasePath(movie, basePath, userId, req)));
    }

    async formatMovieWithBasePath(movie, basePath, userId = null, req = null) {
        const movieObj = movie.toObject();
        const formatted = {
            ...movieObj,
            coverImage: movieObj.coverImage ? `${basePath}${movieObj.coverImage}` : null,
            genreId: movieObj.genre ? movieObj.genre._id : null,
            genre: movieObj.genre && typeof movieObj.genre === 'object' ? movieObj.genre.name : movieObj.genre,
            purchased: false,
            isPurchased: false
        };

        // if userId not provided, attempt to extract from request/session
        let effectiveUserId = userId;
        if (!effectiveUserId && req) {
            // common places req.user.id or req.session.userId or req.session.user.id
            if (req.user && req.user.id) effectiveUserId = req.user.id;
            else if (req.session && req.session.userId) effectiveUserId = req.session.userId;
            else if (req.session && req.session.user && req.session.user.id) effectiveUserId = req.session.user.id;
        }

        if (effectiveUserId) {
            try {
                // fetch latest transaction for this user and movie (if any)
                const records = await this.transactionRepository.find({ userId: effectiveUserId, movieId: movieObj._id }, null, { createdAt: -1 });
                const transaction = Array.isArray(records) && records.length > 0 ? records[0] : null;
                const purchased = transaction && transaction.status === 'paid';
                formatted.purchased = purchased;
                formatted.isPurchased = purchased;
                formatted.transaction = transaction;
            } catch (e) {
                // ignore transaction lookup errors and keep purchased=false
                formatted.transaction = null;
            }
        } else {
            formatted.transaction = null;
        }

        return formatted;
    }
}

module.exports = MovieService;
