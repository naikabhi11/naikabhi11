const mongoose = require('mongoose');

const finishedProductSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        default: 'pcs'
    },
    manufacturingDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: Date,
    batchNumber: String,
    location: String,
    qualityStatus: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FinishedProduct', finishedProductSchema);
