const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * send({ to, subject, html })
 */
const send = (opts) =>
    transporter.sendMail({
        from: process.env.MAIL_FROM,
        ...opts,
    });

module.exports = { send };
