const router = require('express').Router();
const { Report } = require('../models/index');
const User = require('../models/User');
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { send } = require('../mailer');
const { reportSubmittedTemplate } = require('../notificationTemplates');

router.get('/', auth, rbac('kendrapramuk', 'mukhyadhyapak'), async (req, res) => {
    try {
        const filter = req.user.role === 'mukhyadhyapak' ? { schoolId: req.user.schoolId } : {};
        res.json(await Report.find(filter).lean());
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('mukhyadhyapak'), validate(['title']), async (req, res) => {
    try {
        const report = await Report.create({
            ...req.body,
            schoolId: req.user.schoolId,
            submittedBy: req.user.name,
            status: 'submitted',
            date: new Date().toISOString().split('T')[0],
        });
        res.status(201).json(report);
        const kendra = await User.findOne({ role: 'kendrapramuk' });
        const school = await School.findOne({ id: req.user.schoolId });
        if (kendra?.email) {
            const { subject, html } = reportSubmittedTemplate({
                schoolName: school?.name || `School ${req.user.schoolId}`,
                reportTitle: report.title, submittedBy: req.user.name, period: report.period,
            });
            send({ to: kendra.email, subject, html }).catch(e => console.error(e.message));
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/status', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.json(report);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
