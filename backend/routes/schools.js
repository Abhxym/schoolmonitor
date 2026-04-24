const router = require('express').Router();
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// Kendrapramuk only: get all schools WITH access codes (must be BEFORE /:id)
router.get('/admin/access-codes', auth, rbac('kendrapramuk'), async (req, res) => {
    try { res.json(await School.find().sort({ id: 1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: list all schools (hide accessCode)
router.get('/', async (req, res) => {
    try { res.json(await School.find().sort({ id: 1 }).select('-accessCode').lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: single school detail (hide accessCode)
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findOne({ id: parseInt(req.params.id) }).select('-accessCode').lean();
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json(school);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
