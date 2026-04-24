require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connect } = require('./mongoose');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    message: { message: 'Too many login attempts. Try again in 15 minutes.' },
    standardHeaders: true, legacyHeaders: false,
}));
app.use('/api', rateLimit({
    windowMs: 60 * 1000, max: 200,
    standardHeaders: true, legacyHeaders: false,
}));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/attendance',    require('./routes/attendance'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/reports',       require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/schools',       require('./routes/schools'));
app.use('/api/gr',            require('./routes/gr'));
app.use('/api/forms',         require('./routes/forms'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/users',         require('./routes/users'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

connect()
    .then(() => seed())
    .then(() => app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`)))
    .catch(err => { console.error('Startup error:', err.message); process.exit(1); });
