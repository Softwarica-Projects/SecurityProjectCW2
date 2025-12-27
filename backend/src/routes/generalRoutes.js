const express = require('express');
const router = express.Router();
const GeneralController = require('../controllers/generalController');
const generalController = new GeneralController();
const { defaultLimiter } = require('../middlewares/rateLimitMiddleware');

router.get('/summary', defaultLimiter, generalController.getSummary.bind(generalController));

module.exports = router;