const router = require('express').Router();
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const ACCESS_CODES = {
    1: 'PUNE2025',        2: 'NASHIK2025',     3: 'NAGPUR2025',
    4: 'AURANGABAD2025',  5: 'SOLAPUR2025',    6: 'KOLHAPUR2025',
    7: 'AMRAVATI2025',    8: 'LATUR2025',      9: 'SATARA2025',
    10: 'SANGLI2025',     11: 'JALGAON2025',   12: 'AKOLA2025',
};

module.exports.ACCESS_CODES = ACCESS_CODES;

// Public — school directory
router.get('/', async (req, res) => {
    try { res.json(await School.find().sort({ id: 1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// Kendrapramuk only — returns schools with access codes for dashboard
router.get('/admin/access-codes', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const schools = await School.find().sort({ id: 1 }).lean();
        res.json(schools.map(s => ({
            id: s.id,
            name: s.name.replace('Zilla Parishad School ', 'ZP School '),
            accessCode: ACCESS_CODES[s.id] || 'N/A',
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Single school
router.get('/:id', auth, rbac('kendrapramuk', 'mukhyadhyapak'), async (req, res) => {
    try {
        const school = await School.findOne({ id: parseInt(req.params.id) }).lean();
        if (!school) return res.status(404).json({ message: 'School not found' });
        if (req.user.role === 'mukhyadhyapak' && school.id !== req.user.schoolId)
            return res.status(403).json({ message: 'Access denied to this school' });
        res.json(school);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
