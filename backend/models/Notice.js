const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Exam', 'Circular', 'Scholarship', 'Event', 'Admission', 'General'],
        default: 'General'
    },
    attachment: String, // PDF file path
    isActive: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    expiresAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Notice', NoticeSchema);
