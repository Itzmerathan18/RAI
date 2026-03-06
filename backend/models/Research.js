const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    facultyGuide: { type: String, required: true },
    teamMembers: [String],
    fundedAmount: { type: String, default: '' },
    fundingAgency: { type: String, default: '' },
    description: { type: String, default: '' },
    paperUrl: { type: String, default: '' },
    domain: {
        type: String,
        enum: ['Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other'],
        default: 'Other'
    },
    year: { type: Number, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Research', ResearchSchema);
