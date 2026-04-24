const router = require('express').Router();
const mongoose = require('mongoose');
const { send } = require('../mailer');
const { contactConfirmTemplate, contactAdminTemplate } = require('../emailTemplates');

// Inline schema — contact messages don't need a full model file
const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
    firstName: String, lastName: String, email: String, topic: String, message: String,
}, { timestamps: true }));

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, topic, message } = req.body;
        if (!firstName || !email || !message)
            return res.status(400).json({ message: 'firstName, email and message are required' });
        await Message.create({ firstName, lastName, email, topic, message });
        const confirm = contactConfirmTemplate({ firstName, topic, message });
        const admin   = contactAdminTemplate({ firstName, lastName, email, topic, message });
        Promise.all([
            send({ to: email, ...confirm }),
            send({ to: process.env.MAIL_USER, ...admin }),
        ]).catch(err => console.error('Contact mail error:', err.message));
        res.status(201).json({ message: 'Message received. A confirmation has been sent to your email.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
