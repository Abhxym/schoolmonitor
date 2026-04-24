const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { send } = require('../mailer');
const { passwordResetTemplate } = require('../emailTemplates');

const SECRET = process.env.JWT_SECRET || 'school_monitor_secret';
const APP_URL = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const resetTokens = new Map();

// Access codes per school — imported from schools route
const { ACCESS_CODES } = require('./schools');

const makeToken = (user) => {
    const payload = { id: user._id, role: user.role, name: user.name };
    if (user.schoolId) payload.schoolId = user.schoolId;
    return jwt.sign(payload, SECRET, { expiresIn: '8h' });
};

const safeUser = (user) => ({
    id: user._id, name: user.name, email: user.email,
    role: user.role, schoolId: user.schoolId ?? null, avatar: user.avatar ?? null,
});

// ── Register ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, schoolId, accessCode } = req.body;
        if (!name || !email || !password || !schoolId || !accessCode)
            return res.status(400).json({ message: 'All fields are required' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const expected = ACCESS_CODES[String(schoolId)];
        if (!expected || accessCode.toUpperCase() !== expected)
            return res.status(400).json({ message: 'Invalid access code for this school' });
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ message: 'An account with this email already exists' });
        const user = await User.create({
            name, email: email.toLowerCase(),
            password: bcrypt.hashSync(password, 8),
            role: 'mukhyadhyapak',
            schoolId: parseInt(schoolId),
        });
        res.status(201).json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.toLowerCase() });
        if (!user || !bcrypt.compareSync(password, user.password))
            return res.status(401).json({ message: 'Invalid credentials' });
        res.json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, schoolId, accessCode } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email and password are required' });
        if (!schoolId)
            return res.status(400).json({ message: 'Please select a school' });
        if (!accessCode)
            return res.status(400).json({ message: 'School access code is required' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        // Verify school access code
        const School = require('../models/School');
        const school = await School.findOne({ id: parseInt(schoolId) });
        if (!school)
            return res.status(404).json({ message: 'School not found' });
        if (school.accessCode !== accessCode.trim().toUpperCase())
            return res.status(403).json({ message: 'Invalid access code. Please contact your Kendrapramuk for the correct code.' });
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ message: 'An account with this email already exists' });
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: bcrypt.hashSync(password, 8),
            role: 'mukhyadhyapak',
            schoolId: parseInt(schoolId),
            provisioned: true,
        });
        res.status(201).json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/google', async (req, res) => {
    try {
        const { email, name, googleId, avatar } = req.body;
        if (!email) return res.status(400).json({ message: 'email is required' });
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email: email.toLowerCase(),
                password: '',
                role: 'mukhyadhyapak',
                schoolId: null,
                googleId, avatar,
                provisioned: true,
            });
        }
        res.json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'email is required' });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            resetTokens.set(token, { userId: user._id.toString(), expires: Date.now() + 60 * 60 * 1000 });
            const resetUrl = `${APP_URL}/reset-password?token=${token}`;
            const { subject, html } = passwordResetTemplate({ name: user.name, resetUrl });
            send({ to: user.email, subject, html }).catch(err => console.error('Mail error:', err.message));
        }
        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: 'token and password are required' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const entry = resetTokens.get(token);
        if (!entry || entry.expires < Date.now())
            return res.status(400).json({ message: 'Reset link is invalid or has expired' });
        const user = await User.findById(entry.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.password = bcrypt.hashSync(password, 8);
        await user.save();
        resetTokens.delete(token);
        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(safeUser(user));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
