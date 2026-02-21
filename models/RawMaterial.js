const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Material name is required'],
        trim: true,
        index: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required']
    },
    minimumStockLevel: {
        type: Number,
        default: 0
    },
    costPerUnit: {
        type: Number,
        default: 0
    },
    supplier: {
        type: String
    },
    location: {
        type: String
    },
    specs: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
