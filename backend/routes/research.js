const express = require('express');
const Research = require('../models/Research');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET all research (public) — supports search, domain, status, year filters + pagination
router.get('/', async (req, res) => {
    try {
        const { search, domain, status, year, page = 1, limit = 12 } = req.query;
        const filter = { published: true };
        if (domain && domain !== 'All') filter.domain = domain;
        if (status && status !== 'All') filter.status = status;
        if (year) filter.year = Number(year);
        if (search) filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { facultyGuide: { $regex: search, $options: 'i' } },
        ];
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Research.find(filter).sort({ year: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
            Research.countDocuments(filter),
        ]);
        res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET single research project
router.get('/:id', async (req, res) => {
    try {
        const item = await Research.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST create (admin only)
router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Research.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// PUT update (admin only)
router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// DELETE (admin only)
router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const item = await Research.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
