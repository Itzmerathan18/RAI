const express = require('express');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, upcoming } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (upcoming === 'true') filter.isUpcoming = true;
        const events = await Event.find(filter).sort('-date');
        res.json({ success: true, count: events.length, data: events });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'event_manager'), upload.array('images', 10), async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(f => `/uploads/${f.filename}`);
        }
        const event = await Event.create(data);
        res.status(201).json({ success: true, data: event });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'event_manager'), async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin', 'event_manager'), async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Event deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
