const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    equipment: [String],
    images: [String],
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lab', LabSchema);
