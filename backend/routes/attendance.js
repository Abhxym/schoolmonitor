const router = require('express').Router();
const { Attendance } = require('../models/index');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');

// Public (aggregate transparency figures); a logged-in Mukhyadhyapak only ever sees their own school.
router.get('/', auth.optional, async (req, res) => {
    try {
        const { date, schoolId } = req.query;
        const filter = {};
        if (schoolId) filter.schoolId = parseInt(schoolId);
        if (req.user?.role === 'mukhyadhyapak') filter.schoolId = req.user.schoolId;
        if (date) filter.date = date;
        const records = await Attendance.find(filter).sort({ date: 1, schoolId: 1 }).lean();
        res.json(records);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('mukhyadhyapak'), validate(['date', 'present', 'absent', 'total']), async (req, res) => {
    try {
        if (!req.user.schoolId)
            return res.status(403).json({ message: 'Your account has no school assigned yet. Contact your Kendrapramuk.' });
        if (req.body.schoolId != null && Number(req.body.schoolId) !== req.user.schoolId)
            return res.status(403).json({ message: 'Cannot submit attendance for another school' });
        const record = await Attendance.create({ ...req.body, schoolId: req.user.schoolId });
        res.status(201).json(record);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
