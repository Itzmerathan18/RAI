const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    batch: { type: String, required: true },
    currentPosition: String,
    currentOrganization: String,
    photo: { type: String, default: '/images/default-avatar.png' },
    linkedinLink: String,
    email: String,
    successStory: String,
    isMentor: { type: Boolean, default: false },
    domain: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alumni', AlumniSchema);
