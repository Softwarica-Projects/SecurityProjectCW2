const rateLimit = require('express-rate-limit');

// For General APIS
const defaultLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '6'),
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// For AUTH APIs
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS_AUTH || '60000'), 
    max: parseInt(process.env.RATE_LIMIT_MAX_AUTH || '6'), 
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts, please slow down.' }
});

module.exports = {
    defaultLimiter,
    authLimiter
};
