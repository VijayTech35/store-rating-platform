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

initSchema().catch(err => console.error('Failed to init schema (non-fatal):', err));

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
const distExists = fs.existsSync(frontendDist);
const indexPath = path.join(frontendDist, 'index.html');
const indexExists = fs.existsSync(indexPath);

console.log(`Frontend dist: ${frontendDist} exists=${distExists}, index.html exists=${indexExists}`);

if (!distExists || !indexExists) {
  console.error('Frontend build not found! Run: cd frontend && npm install && npm run build');
}

// Debug endpoint to check dist contents
app.get('/api/debug/dist', (_req, res) => {
  try {
    let assets = [];
    const assetsDir = path.join(frontendDist, 'assets');
    if (fs.existsSync(assetsDir)) {
      assets = fs.readdirSync(assetsDir, { withFileTypes: true }).map(d => d.name);
    }
    res.json({ distExists, indexExists, frontendDist, assets, __dirname });
  } catch (e) { res.json({ error: e.message }); }
});

if (distExists) {
  app.use(express.static(frontendDist, { maxAge: '1h' }));
}

app.get('*', (_req, res) => {
  if (indexExists) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>VibeRate</title><style>body{background:#0f172a;color:#e2e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}.card{background:#1e293b;padding:2rem;border-radius:1rem;max-width:400px}h1{color:#a78bfa;font-size:1.5rem}p{color:#94a3b8;font-size:0.875rem}.status{color:#22c55e;font-weight:600}</style></head><body><div class="card"><h1>VibeRate</h1><p class="status">Server is running</p><p>The React frontend is being built. Try again in a moment.</p></div></body></html>`);
  }
});

app.use(errorHandler);

module.exports = app;
