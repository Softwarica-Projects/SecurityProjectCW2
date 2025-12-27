const mongoose = require('mongoose');
const Roles = require('../enums/roles.enum');
const RegexConstants = require('../constants/regex.constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [RegexConstants.EMAIL, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    passwordHistory: {
        type: [String],
        default: [],
    },
    passwordChangedAt: {
        type: Date,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockoutUntil: {
        type: Date,
    },
    role: {
        type: String,
        enum: Object.values(Roles),
        default: Roles.USER,
    },
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;