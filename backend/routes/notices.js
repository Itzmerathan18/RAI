const express = require('express');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };
        if (category) filter.category = category;
        const notices = await Notice.find(filter).sort('-date').limit(20);
        res.json({ success: true, count: notices.length, data: notices });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), upload.single('attachment'), async (req, res) => {
    try {
        const data = { ...req.body, createdBy: req.user._id };
        if (req.file) data.attachment = `/uploads/${req.file.filename}`;
        const notice = await Notice.create(data);
        res.status(201).json({ success: true, data: notice });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
        res.json({ success: true, data: notice });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notice deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
