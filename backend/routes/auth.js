const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const School = require('../models/School');
const authMiddleware = require('../middleware/auth');
const { send } = require('../mailer');
const { passwordResetTemplate } = require('../emailTemplates');
const { JWT_SECRET, APP_URL, GOOGLE_CLIENT_ID } = require('../config');

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

const makeToken = (user) => {
    const payload = { id: user._id, role: user.role, name: user.name };
    if (user.schoolId) payload.schoolId = user.schoolId;
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

const safeUser = (user) => ({
    id: user._id, name: user.name, email: user.email,
    role: user.role, schoolId: user.schoolId ?? null, avatar: user.avatar ?? null,
});

// Ask Google to validate an ID token and confirm it was issued for our OAuth client.
async function verifyGoogleIdToken(idToken) {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) return null;
    const info = await res.json();
    if (info.aud !== GOOGLE_CLIENT_ID) return null;
    if (info.email_verified !== 'true' && info.email_verified !== true) return null;
    return info;
}

// ── Register ──────────────────────────────────────────────────────────────────
// Self-registration is only for Mukhyadhyapaks, gated by the school's access code
// (the Kendrapramuk sees these codes on the User Management page).
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, schoolId, accessCode } = req.body;
        if (!name || !email || !password || !schoolId || !accessCode)
            return res.status(400).json({ message: 'All fields are required' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const sid = parseInt(schoolId);
        const school = await School.findOne({ id: sid }).lean();
        if (!school || accessCode.trim().toUpperCase() !== school.accessCode.toUpperCase())
            return res.status(400).json({ message: 'Invalid access code for this school. Contact your Kendrapramuk.' });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ message: 'An account with this email already exists' });

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: bcrypt.hashSync(password, 10),
            role: 'mukhyadhyapak',
            schoolId: sid,
        });

        res.status(201).json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
        const user = await User.findOne({ email: email.toLowerCase() });
        // Google-only accounts have no password hash and cannot log in this way
        if (!user || !user.password || !bcrypt.compareSync(password, user.password))
            return res.status(401).json({ message: 'Invalid credentials' });
        res.json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Google OAuth ──────────────────────────────────────────────────────────────
// Called by the NextAuth server callback with the Google ID token. The identity comes
// from Google's verification, never from the request body.
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'idToken is required' });
        if (!GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google sign-in is not configured' });

        const info = await verifyGoogleIdToken(idToken);
        if (!info) return res.status(401).json({ message: 'Google token could not be verified' });

        const email = info.email.toLowerCase();
        let user = await User.findOne({ email });
        if (!user) {
            // New Google users start as an unassigned Mukhyadhyapak; the Kendrapramuk assigns a school.
            user = await User.create({
                name: info.name || email.split('@')[0],
                email,
                password: '',
                role: 'mukhyadhyapak',
                schoolId: null,
                googleId: info.sub,
                avatar: info.picture,
                provisioned: true,
            });
        } else if (!user.googleId) {
            user.googleId = info.sub;
            if (!user.avatar) user.avatar = info.picture;
            await user.save();
        }
        res.json({ token: makeToken(user), user: safeUser(user) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Forgot Password ───────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'email is required' });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            user.resetTokenHash = sha256(token);
            user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
            await user.save();
            const resetUrl = `${APP_URL}/reset-password?token=${token}`;
            const { subject, html } = passwordResetTemplate({ name: user.name, resetUrl });
            send({ to: user.email, subject, html }).catch(err => console.error('Mail error:', err.message));
        }
        // Same reply either way so the endpoint can't be used to check which emails exist
        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Reset Password ────────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: 'token and password are required' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const user = await User.findOne({ resetTokenHash: sha256(token), resetTokenExpires: { $gt: new Date() } });
        if (!user)
            return res.status(400).json({ message: 'Reset link is invalid or has expired' });
        user.password = bcrypt.hashSync(password, 10);
        user.resetTokenHash = null;
        user.resetTokenExpires = null;
        await user.save();
        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Me ────────────────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(safeUser(user));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
