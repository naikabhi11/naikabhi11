const FinishedProduct = require('../models/FinishedProduct');

// @desc    Get all finished products
// @route   GET /api/finished-products
exports.getFinishedProducts = async (req, res, next) => {
    try {
        const products = await FinishedProduct.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Add finished product
// @route   POST /api/finished-products
exports.addFinishedProduct = async (req, res, next) => {
    try {
        const product = await FinishedProduct.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update finished product
// @route   PUT /api/finished-products/:id
exports.updateFinishedProduct = async (req, res, next) => {
    try {
        const product = await FinishedProduct.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete finished product
// @route   DELETE /api/finished-products/:id
exports.deleteFinishedProduct = async (req, res, next) => {
    try {
        const product = await FinishedProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};
