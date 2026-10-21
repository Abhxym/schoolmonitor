require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connect, isConnected } = require('./mongoose');
const seed = require('./seed');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; rate limits need the real client IP
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// CORS — must be before everything else
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin.endsWith('.vercel.app') || origin === ALLOWED_ORIGIN || origin === 'http://localhost:3000')
            return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions)); // preflight for Express 5
app.use(express.json());

// Stricter limits on endpoints that can be brute-forced or used to send email
const strictLimit = rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    message: { message: 'Too many attempts. Try again in 15 minutes.' },
    standardHeaders: true, legacyHeaders: false,
});
app.use(['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/contact'], strictLimit);
app.use('/api', rateLimit({
    windowMs: 60 * 1000, max: 200,
    standardHeaders: true, legacyHeaders: false,
}));

// Health stays up even without a database, so Render keeps the service reachable
// and the response says what is wrong instead of the request hanging.
let dbError = null;
app.get('/api/health', (_, res) => res.json({ status: 'ok', db: isConnected() ? 'connected' : 'disconnected', dbError }));
app.use('/api', (req, res, next) => {
    if (isConnected()) return next();
    res.status(503).json({ message: 'Database unavailable. Try again in a minute.' });
});

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

app.use((err, req, res, _next) => { // 4 args so Express treats it as the error handler
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Listen first, then keep retrying the database. Exiting on a DB error makes Render
// restart-loop the service, and every request hangs with no explanation.
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

async function connectWithRetry(attempt = 1) {
    try {
        await connect();
        await seed();
        dbError = null;
    } catch (err) {
        dbError = err.message;
        const wait = Math.min(60, 5 * attempt);
        console.error(`MongoDB connection failed (attempt ${attempt}): ${err.message}. Retrying in ${wait}s`);
        setTimeout(() => connectWithRetry(attempt + 1), wait * 1000);
    }
}
connectWithRetry();
