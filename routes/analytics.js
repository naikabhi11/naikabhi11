const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getProductionMetrics,
    getInventoryAnalysis
} = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardStats);
router.get('/production', getProductionMetrics);
router.get('/inventory', getInventoryAnalysis);

module.exports = router;
