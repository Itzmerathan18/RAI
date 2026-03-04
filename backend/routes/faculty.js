const express = require('express');
const Faculty = require('../models/Faculty');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// GET all faculty
router.get('/', async (req, res) => {
    try {
        const { specialization } = req.query;
        const filter = {};
        if (specialization) filter.specialization = specialization;
        const faculty = await Faculty.find(filter).sort('name');
        res.json({ success: true, count: faculty.length, data: faculty });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET single faculty
router.get('/:id', async (req, res) => {
    try {
        const member = await Faculty.findById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });
        res.json({ success: true, data: member });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST create faculty (admin only)
router.post('/', protect, authorize('super_admin', 'faculty_admin'), upload.single('photo'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.photo = `/uploads/${req.file.filename}`;
        const member = await Faculty.create(data);
        res.status(201).json({ success: true, data: member });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// PUT update faculty
router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), upload.single('photo'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.photo = `/uploads/${req.file.filename}`;
        const member = await Faculty.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });
        res.json({ success: true, data: member });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// DELETE faculty
router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const member = await Faculty.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });
        res.json({ success: true, message: 'Faculty deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
