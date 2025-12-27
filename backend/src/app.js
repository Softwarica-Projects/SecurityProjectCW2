require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;


// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Database connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});