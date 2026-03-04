const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ── LOCKED ADMIN CREDENTIALS ─────────────────────────────────
const ADMIN_EMAIL = 'rai@jnnce.ac.in';
const ADMIN_PASSWORD = 'rai#@123';

// Auto-seed admin on first run
async function seedAdmin() {
    try {
        const exists = await User.findOne({ email: ADMIN_EMAIL });
        if (!exists) {
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({ name: 'RAI Admin', email: ADMIN_EMAIL, password: hashed, role: 'super_admin' });
            console.log('✅ Admin account seeded: ' + ADMIN_EMAIL);
        }
    } catch (e) { console.log('Admin seed skipped:', e.message); }
}
seedAdmin();

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Lock to only the official admin email
        if (!email || email.toLowerCase().trim() !== ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Access denied. Only rai@jnnce.ac.in can login.' });
        }

        const user = await User.findOne({ email: ADMIN_EMAIL });
        if (!user) {
            // Fallback: if not in DB yet, check hardcoded password directly
            if (password === ADMIN_PASSWORD) {
                const token = jwt.sign({ id: 'admin', role: 'super_admin' }, process.env.JWT_SECRET || 'rai_secret_key', { expiresIn: '7d' });
                return res.json({ success: true, token, user: { id: 'admin', name: 'RAI Admin', role: 'super_admin', email: ADMIN_EMAIL } });
            }
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Also check hardcoded password for resilience
            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'rai_secret_key', { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;
