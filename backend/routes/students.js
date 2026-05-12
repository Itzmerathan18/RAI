const express = require('express');
const Store = require('../db/store');
const { protect } = require('../middleware/auth');
const router = express.Router();
const COL = 'students';

router.get('/', (req, res) => {
    try {
        const data = Store.find(COL);
        res.json({ success: true, count: data.length, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', (req, res) => {
    try {
        const item = Store.findById(COL, req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, (req, res) => {
    try {
        const item = Store.create(COL, req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, (req, res) => {
    try {
        const item = Store.update(COL, req.params.id, req.body);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, (req, res) => {
    try {
        const item = Store.delete(COL, req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
