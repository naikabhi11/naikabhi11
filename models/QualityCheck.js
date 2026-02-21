const mongoose = require('mongoose');

const qualityCheckSchema = new mongoose.Schema({
    itemReference: {
        type: String, // Can be WIP batch number or Finished Product SKU
        required: true,
        index: true
    },
    itemType: {
        type: String,
        enum: ['wip', 'finished'],
        required: true
    },
    inspector: {
        type: String,
        required: true
    },
    inspectionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pass', 'fail'],
        required: true
    },
    measurements: [{
        parameter: String,
        value: Number,
        unit: String,
        min: Number,
        max: Number,
        result: {
            type: String,
            enum: ['ok', 'out-of-range']
        }
    }],
    notes: String,
    attachments: [String] // URLs to photos/docs
}, {
    timestamps: true
});

module.exports = mongoose.model('QualityCheck', qualityCheckSchema);
