const { Schema, model, models } = require('mongoose');

const UserSchema = new Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, default: '' },
    role:        { type: String, enum: ['kendrapramuk', 'mukhyadhyapak'], required: true },
    schoolId:    { type: Number, default: null },
    googleId:    { type: String, default: null },
    avatar:      { type: String, default: null },
    provisioned: { type: Boolean, default: false },
    // Password reset — only a SHA-256 hash of the emailed token is stored
    resetTokenHash:    { type: String, default: null },
    resetTokenExpires: { type: Date,   default: null },
}, { timestamps: true });

module.exports = models.User || model('User', UserSchema);
