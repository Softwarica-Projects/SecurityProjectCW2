const { BaseException } = require('../exceptions');

const errorHandler = (err, req, res, next) => {
    console.error('Error caught by middleware:', err);

    if (err instanceof BaseException) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err.toJSON() : undefined
        });
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errors
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        return res.status(409).json({
            success: false,
            message: message
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;
