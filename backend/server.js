require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to DB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static file serving (uploaded files)
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

// Analytics endpoint — counts for admin overview
app.get('/api/analytics', async (req, res) => {
    try {
        const [Faculty, Research, Publication, Notice, Lab, Achievement, Gallery, Student, Alumni, Placement] = [
            require('./models/Faculty'),
            require('./models/Research'),
            require('./models/Publication'),
            require('./models/Notice'),
            require('./models/Lab'),
            require('./models/Achievement'),
            require('./models/Gallery'),
            require('./models/Student'),
            require('./models/Alumni'),
            require('./models/Placement'),
        ];
        const [faculty, research, publications, notices, labs, achievements, gallery, students, alumni, placements] = await Promise.all([
            Faculty.countDocuments(),
            Research.countDocuments(),
            Publication.countDocuments(),
            Notice.countDocuments({ isActive: true }),
            Lab.countDocuments(),
            Achievement.countDocuments(),
            Gallery.countDocuments(),
            Student.countDocuments(),
            Alumni.countDocuments(),
            Placement.countDocuments(),
        ]);
        res.json({ success: true, data: { faculty, research, publications, notices, labs, achievements, gallery, students, alumni, placements } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'RAI JNNCE API is running 🚀', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 RAI JNNCE Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
