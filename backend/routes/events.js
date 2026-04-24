const router = require('express').Router();
const { Event } = require('../models/index');
const User = require('../models/User');
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { send } = require('../mailer');
const { eventSubmittedTemplate, eventStatusTemplate } = require('../notificationTemplates');

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        res.json(await Event.find(filter).lean());
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('mukhyadhyapak'), validate(['title', 'date', 'description']), async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, schoolId: req.user.schoolId, status: 'pending' });
        res.status(201).json(event);
        // Email Kendrapramuk
        const kendra = await User.findOne({ role: 'kendrapramuk' });
        const school = await School.findOne({ id: req.user.schoolId });
        if (kendra?.email) {
            const { subject, html } = eventSubmittedTemplate({
                schoolName: school?.name || `School ${req.user.schoolId}`,
                eventTitle: event.title, eventDate: event.date, submittedBy: req.user.name,
            });
            send({ to: kendra.email, subject, html }).catch(e => console.error(e.message));
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/status', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status))
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
        // Email submitter
        const submitter = await User.findOne({ schoolId: event.schoolId, role: 'mukhyadhyapak' });
        if (submitter?.email) {
            const { subject, html } = eventStatusTemplate({ mukhyadhyapakName: submitter.name, eventTitle: event.title, status });
            send({ to: submitter.email, subject, html }).catch(e => console.error(e.message));
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
