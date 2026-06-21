const path = require('path');
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { initSchema } = require('./config/database');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

initSchema().catch(err => { console.error('Failed to init schema:', err); process.exit(1); });

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many requests, please try again later.' } });
app.use(limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many auth attempts, please try again later.' } });

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve built frontend in production
const frontendDist = path.join(__dirname, '../../frontend/dist');
const fs = require('fs');

// Debug endpoint to check dist contents
app.get('/api/debug/dist', (_req, res) => {
  try {
    const items = fs.readdirSync(path.join(frontendDist, 'assets'), { withFileTypes: true }).map(d => d.name);
    res.json({ distExists: fs.existsSync(frontendDist), indexExists: fs.existsSync(path.join(frontendDist, 'index.html')), frontendDist, assets: items });
  } catch (e) { res.json({ error: e.message }); }
});

app.use(express.static(frontendDist, { maxAge: '1h' }));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(errorHandler);

module.exports = app;
