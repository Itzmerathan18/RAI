const express = require('express');
const Lab = require('../models/Lab');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await Lab.find({ published: true }).sort('name');
        res.json({ success: true, count: data.length, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Lab.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Lab.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const item = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const item = await Lab.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
