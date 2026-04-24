const { Schema, model, models } = require('mongoose');

const AttendanceSchema = new Schema({
    schoolId: { type: Number, required: true },
    date:     { type: String, required: true },
    present:  { type: Number, required: true },
    absent:   { type: Number, required: true },
    total:    { type: Number, required: true },
}, { timestamps: true });

const EventSchema = new Schema({
    title:       { type: String, required: true },
    date:        { type: String, required: true },
    description: { type: String, required: true },
    schoolId:    { type: Number, required: true },
    category:    { type: String, default: '' },
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const ReportSchema = new Schema({
    schoolId:    { type: Number, required: true },
    title:       { type: String, required: true },
    submittedBy: { type: String, required: true },
    status:      { type: String, enum: ['pending', 'submitted', 'reviewed', 'flagged'], default: 'submitted' },
    date:        { type: String },
    period:      { type: String },
    status_detail: { type: String },
    remarks:     { type: String },
}, { timestamps: true });

const NotificationSchema = new Schema({
    message:   { type: String, required: true },
    type:      { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
    read:      { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const GRDocumentSchema = new Schema({
    grNumber:   { type: String, required: true },
    title:      { type: String, required: true },
    category:   { type: String, required: true },
    date:       { type: String },
    status:     { type: String, default: 'active' },
    fileUrl:    { type: String, default: null },
    publicId:   { type: String, default: null },
    fileType:   { type: String, default: null },
    uploadedBy: { type: String, default: null },
}, { timestamps: true });

const FormTemplateSchema = new Schema({
    fields:      { type: Array, required: true },
    deployedAt:  { type: String },
    deployedBy:  { type: String },
}, { timestamps: true });

module.exports = {
    Attendance:   models.Attendance   || model('Attendance',   AttendanceSchema),
    Event:        models.Event        || model('Event',        EventSchema),
    Report:       models.Report       || model('Report',       ReportSchema),
    Notification: models.Notification || model('Notification', NotificationSchema),
    GRDocument:   models.GRDocument   || model('GRDocument',   GRDocumentSchema),
    FormTemplate: models.FormTemplate || model('FormTemplate', FormTemplateSchema),
};
