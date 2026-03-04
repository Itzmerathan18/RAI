const express = require('express');
const Placement = require('../models/Placement');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const placements = await Placement.find().sort('-year');
        res.json({ success: true, count: placements.length, data: placements });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:year', async (req, res) => {
    try {
        const placement = await Placement.findOne({ year: req.params.year });
        if (!placement) return res.status(404).json({ success: false, message: 'No placement data for this year' });
        res.json({ success: true, data: placement });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'placement_admin'), async (req, res) => {
    try {
        const placement = await Placement.create(req.body);
        res.status(201).json({ success: true, data: placement });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'placement_admin'), async (req, res) => {
    try {
        const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!placement) return res.status(404).json({ success: false, message: 'Placement data not found' });
        res.json({ success: true, data: placement });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
