const Process = require('../models/Process');

// @desc    Get all processes
// @route   GET /api/processes
exports.getProcesses = async (req, res, next) => {
    try {
        const processes = await Process.find();
        res.json(processes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Add new process
// @route   POST /api/processes
exports.addProcess = async (req, res, next) => {
    try {
        const process = await Process.create(req.body);
        res.status(201).json(process);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update process
// @route   PUT /api/processes/:id
exports.updateProcess = async (req, res, next) => {
    try {
        const process = await Process.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!process) {
            return res.status(404).json({ error: 'Process not found' });
        }

        res.json(process);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete process
// @route   DELETE /api/processes/:id
exports.deleteProcess = async (req, res, next) => {
    try {
        const process = await Process.findByIdAndDelete(req.params.id);

        if (!process) {
            return res.status(404).json({ error: 'Process not found' });
        }

        res.json({ message: 'Process deleted successfully' });
    } catch (err) {
        next(err);
    }
};
