// validate(fields) — checks req.body has all required fields
module.exports = (fields) => (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === '');
    if (missing.length)
        return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    next();
};
