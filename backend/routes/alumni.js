const express = require('express');
const Alumni = require('../models/Alumni');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { batch, isMentor } = req.query;
        const filter = {};
        if (batch) filter.batch = batch;
        if (isMentor) filter.isMentor = isMentor === 'true';
        const alumni = await Alumni.find(filter).sort('name');
        res.json({ success: true, count: alumni.length, data: alumni });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin'), async (req, res) => {
    try {
        const alumnus = await Alumni.create(req.body);
        res.status(201).json({ success: true, data: alumnus });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const alumnus = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!alumnus) return res.status(404).json({ success: false, message: 'Alumni not found' });
        res.json({ success: true, data: alumnus });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        await Alumni.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Alumni deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
