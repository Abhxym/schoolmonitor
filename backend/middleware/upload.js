const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'zp-schoolmonitor/gr-documents',
        allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
        resource_type: 'auto',
        // Use original filename (sanitised)
        public_id: (req, file) => {
            const name = file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
            return `${Date.now()}_${name}`;
        },
    },
});

module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit
