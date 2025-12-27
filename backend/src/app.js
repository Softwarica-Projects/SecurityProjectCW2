require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const genreRoutes = require('./routes/genreRoutes');
const generalRoutes = require('./routes/generalRoutes');
const movieRoutes = require('./routes/movieRoutes');
const path = require('path');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
//CORS SETUP
const cors = require('cors');
const rawOrigins = process.env.CORS_ORIGIN;
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('CORS policy: This origin is not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//CSP Setup
const helmet = require('helmet');
const { cspConfig } = require('./config/cspConfig');
app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(
    helmet.contentSecurityPolicy({
        directives: cspConfig,
    })
);


//Xss Sanitizer Setup
const xssSanitizer = require('./middlewares/xssSanitizer');
app.use(xssSanitizer());
//Mongo Sanitize Setup
const mongoSanitize = require('./middlewares/mongoSanitize');
app.use(mongoSanitize());


//Request Logger Setup 
const fs = require('fs');
const bunyan = require('bunyan');
const expressRequestsLogger = require('express-requests-logger');
const logsDir = path.join(__dirname, '../logs');
const activityLogPath = path.join(logsDir, 'activity.log');
try { fs.mkdirSync(logsDir, { recursive: true }); } catch (e) { }

const bunyanLogger = bunyan.createLogger({
    name: 'ExpressLogger',
    streams: [
        { path: activityLogPath, level: 'info' }
    ]
});

app.use(expressRequestsLogger({
    logger: bunyanLogger,
    request: {
        audit: true,
        maskBody: ['password', 'oldPassword', 'newPassword', 'token', 'authorization'],
        maskHeaders: ['authorization'],
        maskQuery: []
    },
    response: { audit: true },
    doubleAudit: false
}));


// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/utility', utilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/movies', movieRoutes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
// Database connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});