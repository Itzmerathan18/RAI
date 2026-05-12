const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const ADMIN_EMAIL = 'rai@jnnce.ac.in';
const ADMIN_PASS_HASH = bcrypt.hashSync('Rai@123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'rai_jnnce_secret_2024';
const LOCAL_ADMIN_TOKEN = 'local_admin_token';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
        if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, ADMIN_PASS_HASH);
        if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const token = jwt.sign({ email, role: 'super_admin' }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { email, name: 'RAI Admin', role: 'super_admin' } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token' });
    const token = authHeader.split(' ')[1];
    if (process.env.NODE_ENV !== 'production' && token === LOCAL_ADMIN_TOKEN) {
        return res.json({ success: true, user: { email: ADMIN_EMAIL, name: 'RAI Admin', role: 'super_admin' } });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, user: decoded });
    } catch { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

module.exports = router;
