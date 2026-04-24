const router = require('express').Router();
const { FormTemplate } = require('../models/index');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', auth, rbac('kendrapramuk', 'mukhyadhyapak'), async (req, res) => {
    try { res.json(await FormTemplate.find().sort({ createdAt: -1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const { fields } = req.body;
        if (!fields || !Array.isArray(fields) || fields.length === 0)
            return res.status(400).json({ message: 'fields array is required and must not be empty' });
        const template = await FormTemplate.create({ fields, deployedAt: new Date().toISOString(), deployedBy: req.user.name });
        res.status(201).json(template);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
