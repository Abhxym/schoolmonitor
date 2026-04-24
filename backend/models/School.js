const { Schema, model, models } = require('mongoose');

const SchoolSchema = new Schema({
    id:         { type: Number, required: true, unique: true },
    name:       { type: String, required: true },
    district:   { type: String, required: true },
    students:   { type: Number, default: 0 },
    teachers:   { type: Number, default: 0 },
    accessCode: { type: String, required: true },
}, { timestamps: true });

module.exports = models.School || model('School', SchoolSchema);
