const router = require('express').Router();
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// Access codes gate registration, so they never leave the server on public routes.
const PUBLIC_FIELDS = '-accessCode -__v';

// Public — school directory
router.get('/', async (req, res) => {
    try { res.json(await School.find().select(PUBLIC_FIELDS).sort({ id: 1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// Kendrapramuk only — schools with their registration access codes
router.get('/admin/access-codes', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const schools = await School.find().sort({ id: 1 }).lean();
        res.json(schools.map(s => ({ id: s.id, name: s.name, accessCode: s.accessCode })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Public — single school (the public school detail page uses this)
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findOne({ id: parseInt(req.params.id) }).select(PUBLIC_FIELDS).lean();
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json(school);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
