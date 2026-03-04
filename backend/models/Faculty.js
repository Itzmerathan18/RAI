const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    specialization: {
        type: String,
        enum: ['Robotics', 'AI/ML', 'Control Systems', 'Embedded Systems', 'Mechatronics', 'Computer Vision', 'IoT'],
        required: true
    },
    experience: { type: Number, default: 0 },
    researchAreas: [String],
    publications: [
        {
            title: String,
            journal: String,
            year: Number,
            link: String
        }
    ],
    patents: [{ title: String, year: Number }],
    email: { type: String, required: true },
    phone: String,
    photo: { type: String, default: '/images/default-avatar.png' },
    googleScholarLink: String,
    linkedinLink: String,
    isSupportStaff: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faculty', FacultySchema);
