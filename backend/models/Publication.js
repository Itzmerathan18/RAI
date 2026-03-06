const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authors: { type: String, required: true },
    journal: { type: String, required: true },
    year: { type: Number, required: true },
    downloadUrl: { type: String, default: '' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publication', PublicationSchema);
