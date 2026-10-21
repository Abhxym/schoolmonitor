const router = require('express').Router();
const { GRDocument } = require('../models/index');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const upload = require('../middleware/upload');
const cloudinary = require('../cloudinary');

router.get('/', auth, rbac('kendrapramuk', 'mukhyadhyapak'), async (req, res) => {
    try { res.json(await GRDocument.find().sort({ createdAt: -1 }).lean()); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, rbac('kendrapramuk'), upload.single('file'), async (req, res) => {
    try {
        const { grNumber, title, category } = req.body;
        if (!grNumber || !title || !category)
            return res.status(400).json({ message: 'grNumber, title and category are required' });
        const doc = await GRDocument.create({
            grNumber, title, category,
            date: new Date().toISOString().split('T')[0],
            status: 'active',
            fileUrl:    req.file?.path    ?? null,
            publicId:   req.file?.filename ?? null,
            fileType:   req.file?.mimetype ?? null,
            uploadedBy: req.user.name,
        });
        res.status(201).json(doc);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, rbac('kendrapramuk'), async (req, res) => {
    try {
        const doc = await GRDocument.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });
        if (doc.publicId) {
            // Uploads use resource_type 'auto', so Cloudinary files PDFs and images as 'image'
            // and Word/Excel files as 'raw'. destroy() needs the matching type.
            const isImageLike = /^image\/|\/pdf$/.test(doc.fileType || '');
            cloudinary.uploader.destroy(doc.publicId, { resource_type: isImageLike ? 'image' : 'raw' })
                .catch(err => console.error('Cloudinary delete failed:', err.message));
        }
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
