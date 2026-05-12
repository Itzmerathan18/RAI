require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const Store = require('./db/store');

const app = express();

// Security + Parsing
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - allow the usual Next.js dev ports plus an optional deployed frontend URL.
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked request from ${origin}`));
    },
    credentials: true
}));

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/events', require('./routes/events'));
app.use('/api/students', require('./routes/students'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/research', require('./routes/research'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/labs', require('./routes/labs'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/about', require('./routes/about'));
app.use('/api/department', require('./routes/department'));
app.use('/api/homepage', require('./routes/homepage'));
app.use('/api/site-settings', require('./routes/siteSettings'));

// Analytics — live counts from JSON store
app.get('/api/analytics', (req, res) => {
    try {
        const data = {
            faculty: Store.count('faculty'),
            research: Store.count('research'),
            publications: Store.count('publications'),
            notices: Store.count('notices'),
            labs: Store.count('labs'),
            achievements: Store.count('achievements'),
            gallery: Store.count('gallery'),
            students: Store.count('students'),
            alumni: Store.count('alumni'),
            placements: Store.count('placements'),
            projects: Store.count('projects'),
            events: Store.count('events'),
            testimonials: Store.count('testimonials'),
        };
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '🚀 RAI JNNCE API running (JSON Store mode)', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 RAI JNNCE Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📁 Using local JSON data store — no MongoDB required!`);
    console.log(`🔐 Admin login configured via environment variables.`);
});
