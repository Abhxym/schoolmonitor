const router = require('express').Router();
const User = require('../models/User');
const School = require('../models/School');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/role', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['kendrapramuk', 'mukhyadhyapak'];
        if (!role || !validRoles.includes(role))
            return res.status(400).json({ message: `Role must be one of: ${validRoles.join(', ')}` });
        if (req.params.id === req.user.id.toString())
            return res.status(400).json({ message: 'Cannot modify your own role' });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/school', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const schoolId = parseInt(req.body.schoolId);
        const school = await School.findOne({ id: schoolId });
        if (!school) return res.status(400).json({ message: 'Invalid schoolId' });
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { schoolId, provisioned: false },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
