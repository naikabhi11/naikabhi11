const mongoose = require('mongoose');

const wipSchema = new mongoose.Schema({
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        unique: true,
        index: true
    },
    productId: {
        type: String, // Reference or name of product being made
        required: true
    },
    processId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Process',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    currentStage: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    estimatedCompletionDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'paused', 'completed', 'cancelled'],
        default: 'in-progress'
    },
    assignedOperators: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Wip', wipSchema);
