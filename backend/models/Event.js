const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: ['Workshop', 'Competition', 'Guest Lecture', 'Industrial Visit', 'Conference', 'Hackathon', 'Other'],
        default: 'Other'
    },
    date: { type: Date, required: true },
    venue: String,
    images: [String],
    videoUrl: String,
    isUpcoming: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
