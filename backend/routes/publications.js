const express = require('express');
const Publication = require('../models/Publication');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET all publications (public) — search + pagination
router.get('/', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const filter = { published: true };
        if (search) filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { authors: { $regex: search, $options: 'i' } },
            { journal: { $regex: search, $options: 'i' } },
        ];
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Publication.find(filter).sort({ year: -1 }).skip(skip).limit(Number(limit)),
            Publication.countDocuments(filter),
        ]);
        res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Publication.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Publication.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const item = await Publication.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
