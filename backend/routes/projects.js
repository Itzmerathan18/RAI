const express = require('express');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { status, domain, year } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (domain) filter.domain = domain;
        if (year) filter.year = parseInt(year);
        const projects = await Project.find(filter).populate('faculty', 'name designation').sort('-year');
        res.json({ success: true, count: projects.length, data: projects });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('faculty', 'name designation email');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.json({ success: true, data: project });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin', 'faculty_admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.json({ success: true, data: project });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.json({ success: true, message: 'Project deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
