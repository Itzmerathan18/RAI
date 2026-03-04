const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    year: { type: Number, required: true, unique: true },
    totalStudents: { type: Number, required: true },
    placedStudents: { type: Number, required: true },
    highestPackage: { type: Number, required: true }, // in LPA
    averagePackage: { type: Number, required: true }, // in LPA
    companies: [
        {
            name: String,
            logo: String,
            studentsHired: Number
        }
    ],
    internships: { type: Number, default: 0 },
    coreRoboticsPlaced: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Placement', PlacementSchema);
