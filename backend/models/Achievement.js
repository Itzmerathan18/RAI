const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    achievementTitle: { type: String, required: true },
    eventName: { type: String, default: '' },
    awardRank: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
