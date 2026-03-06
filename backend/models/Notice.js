const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Exam', 'Circular', 'Scholarship', 'Event', 'Admission', 'General', 'Holiday', 'Placement', 'Result'],
        default: 'General'
    },
    attachment: String,       // PDF file path (legacy)
    documentUrl: String,      // Cloudinary / public URL for downloadable PDF
    important: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    expiresAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Notice', NoticeSchema);
