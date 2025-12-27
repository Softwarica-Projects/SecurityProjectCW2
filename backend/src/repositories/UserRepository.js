const BaseRepository = require('./BaseRepository');
const User = require('../models/userModel');
const Movie = require('../models/movieModel');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.findOne({ email });
    }

    async findByEmailExcludingId(email, excludeId) {
        return await this.findOne({ email, _id: { $ne: excludeId } });
    }

    async getUserWithFavorites(userId) {
        return await this.findById(userId, {
            path: 'favourites',
            select: ''
        });
    }

    async addToFavorites(userId, movieId) {
        return await this.updateById(userId, {
            $addToSet: { favourites: movieId }
        });
    }

    async removeFromFavorites(userId, movieId) {
        return await this.updateById(userId, {
            $pull: { favourites: movieId }
        });
    }

    async findByIdWithoutPassword(id) {
        return await this.findById(id).select('-password -__v');
    }

    async getUserStats(userId) {
        const user = await User.findById(userId).select('favourites').lean();
        
        const ratedMoviesCount = await Movie.countDocuments({
            'ratings.userId': userId
        });
        const viewedMoviesCount = await Movie.countDocuments({
            'viewedBy': userId
        });

        const mostViewedMovie = await Movie.findOne({
            'viewedBy': userId
        })
        .sort({ views: -1 })
        .select('_id title views coverImage genre')
        .populate('genre', 'name')
        .lean();

        return {
            ratedMoviesCount,
            viewedMoviesCount,
            favouriteMoviesCount: user?.favourites?.length || 0,
            mostViewedMovie
        };
    }
}

module.exports = UserRepository;
