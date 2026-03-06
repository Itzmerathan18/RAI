const express = require('express');
const Achievement = require('../models/Achievement');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        const filter = { published: true };
        if (year) filter.year = Number(year);
        const data = await Achievement.find(filter).sort({ year: -1, createdAt: -1 });
        res.json({ success: true, count: data.length, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Achievement.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const item = await Achievement.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
