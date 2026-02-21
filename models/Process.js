const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Process name is required'],
        trim: true,
        index: true
    },
    description: {
        type: String
    },
    stages: [{
        name: {
            type: String,
            required: true
        },
        duration: Number, // Estimated duration in minutes
        description: String,
        order: Number
    }],
    estimatedTotalTime: {
        type: Number // in minutes
    },
    requiredCertifications: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Process', processSchema);
