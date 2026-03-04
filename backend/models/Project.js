const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    domain: {
        type: String,
        enum: ['Autonomous Robots', 'Computer Vision', 'SLAM', 'AI Automation', 'Control & Path Planning', 'IoT', 'Other']
    },
    fundingAgency: String,
    fundingAmount: Number,
    year: { type: Number, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    publications: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
