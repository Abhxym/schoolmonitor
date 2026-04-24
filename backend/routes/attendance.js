const router = require('express').Router();
const { Attendance } = require('../models/index');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        const { date, schoolId } = req.query;
        const token = req.headers.authorization?.split(' ')[1];
        const filter = {};
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET || 'school_monitor_secret');
                if (user.role === 'mukhyadhyapak') filter.schoolId = user.schoolId;
            } catch { /* public fallback */ }
        }
        if (schoolId) filter.schoolId = parseInt(schoolId);
        if (date) filter.date = date;
        const records = await Attendance.find(filter).lean();
        res.json(records);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('mukhyadhyapak'), validate(['date', 'present', 'absent', 'total']), async (req, res) => {
    try {
        if (req.body.schoolId !== req.user.schoolId)
            return res.status(403).json({ message: 'Cannot submit attendance for another school' });
        const record = await Attendance.create({ ...req.body, schoolId: req.user.schoolId });
        res.status(201).json(record);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
