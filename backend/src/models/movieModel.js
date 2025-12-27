const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    trailerLink: {
        type: String,
        default: null,
    },
    movieLink: {
        type: String,
        default: null,
    },
    cast: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
    ],
    ratings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true,
            },
            review: {
                type: String,
                default: '',
            },
        },
    ],
    coverImage: {
        type: String,
        default: null,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    viewedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    movieType: {
        type: String,
        enum: ['movie', 'series'],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    runtime: {
        type: Number,
        required: true,
    },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;