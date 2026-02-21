const Wip = require('../models/Wip');

// @desc    Get all WIP items
// @route   GET /api/wip
exports.getWipItems = async (req, res, next) => {
    try {
        const wipItems = await Wip.find().populate('processId');
        res.json(wipItems);
    } catch (err) {
        next(err);
    }
};

// @desc    Start new production batch
// @route   POST /api/wip
exports.addWipItem = async (req, res, next) => {
    try {
        const wipItem = await Wip.create(req.body);
        res.status(201).json(wipItem);
    } catch (err) {
        next(err);
    }
};

// @desc    Update WIP progress
// @route   PUT /api/wip/:id
exports.updateWipItem = async (req, res, next) => {
    try {
        const wipItem = await Wip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!wipItem) {
            return res.status(404).json({ error: 'WIP item not found' });
        }

        res.json(wipItem);
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel production (delete WIP)
// @route   DELETE /api/wip/:id
exports.deleteWipItem = async (req, res, next) => {
    try {
        const wipItem = await Wip.findByIdAndDelete(req.params.id);

        if (!wipItem) {
            return res.status(404).json({ error: 'WIP item not found' });
        }

        res.json({ message: 'Production cancelled successfully' });
    } catch (err) {
        next(err);
    }
};
