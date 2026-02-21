const QualityCheck = require('../models/QualityCheck');

// @desc    Get all quality checks
// @route   GET /api/quality-checks
exports.getQualityChecks = async (req, res, next) => {
    try {
        const checks = await QualityCheck.find();
        res.json(checks);
    } catch (err) {
        next(err);
    }
};

// @desc    Get quality checks for specific item
// @route   GET /api/quality-checks/:itemId
exports.getQualityChecksForItem = async (req, res, next) => {
    try {
        const checks = await QualityCheck.find({ itemReference: req.params.itemId });
        res.json(checks);
    } catch (err) {
        next(err);
    }
};

// @desc    Record new quality check
// @route   POST /api/quality-checks
exports.addQualityCheck = async (req, res, next) => {
    try {
        const check = await QualityCheck.create(req.body);
        res.status(201).json(check);
    } catch (err) {
        next(err);
    }
};
