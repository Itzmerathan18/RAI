const express = require('express');
const Gallery = require('../models/Gallery');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET all events (public) — supports category filter
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = { published: true };
        if (category && category !== 'All') filter.category = category;
        if (status && status !== 'All') filter.status = status;
        const data = await Gallery.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: data.length, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET single gallery event
router.get('/:id', async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Gallery.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
