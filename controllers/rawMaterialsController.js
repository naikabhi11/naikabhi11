const RawMaterial = require('../models/RawMaterial');

// @desc    Get all raw materials
// @route   GET /api/raw-materials
exports.getRawMaterials = async (req, res, next) => {
    try {
        const materials = await RawMaterial.find();
        res.json(materials);
    } catch (err) {
        next(err);
    }
};

// @desc    Add new raw material
// @route   POST /api/raw-materials
exports.addRawMaterial = async (req, res, next) => {
    try {
        const material = await RawMaterial.create(req.body);
        res.status(201).json(material);
    } catch (err) {
        next(err);
    }
};

// @desc    Update raw material
// @route   PUT /api/raw-materials/:id
exports.updateRawMaterial = async (req, res, next) => {
    try {
        const material = await RawMaterial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }

        res.json(material);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete raw material
// @route   DELETE /api/raw-materials/:id
exports.deleteRawMaterial = async (req, res, next) => {
    try {
        const material = await RawMaterial.findByIdAndDelete(req.params.id);

        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }

        res.json({ message: 'Material deleted successfully' });
    } catch (err) {
        next(err);
    }
};
