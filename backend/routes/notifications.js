// notifications.js
const router = require('express').Router();
const { Notification } = require('../models/index');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', auth, rbac('kendrapramuk'), async (req, res) => {
    try { res.json(await Notification.find().sort({ createdAt: -1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/read', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!n) return res.status(404).json({ message: 'Not found' });
        res.json(n);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
