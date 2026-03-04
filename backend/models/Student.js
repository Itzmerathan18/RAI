const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    usn: String,
    batch: { type: String, required: true },
    photo: { type: String, default: '/images/default-avatar.png' },
    achievements: [
        {
            title: String,
            description: String,
            year: Number,
            category: { type: String, enum: ['Hackathon', 'Competition', 'Startup', 'Research', 'Other'] }
        }
    ],
    internships: [
        {
            company: String,
            role: String,
            duration: String,
            year: Number
        }
    ],
    finalYearProject: {
        title: String,
        description: String,
        guide: String
    },
    linkedinLink: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
