const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/', authenticate, dashboardController.index);

module.exports = router;