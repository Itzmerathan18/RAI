const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ['Events', 'Competitions', 'Cultural', 'Projects', 'Industrial Visits', 'Students', 'Workshops', 'Laboratories', 'College Events'],
        default: 'Events'
    },
    eventDuration: { type: String, default: '' },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'completed' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    images: [String],
    videos: [String],
    results: { type: String, default: '' },
    date: { type: String, default: '' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);
