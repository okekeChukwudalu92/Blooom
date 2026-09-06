import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../utils/storage.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// POST /api/upload — form-data field name: "file"
// Returns { url } which you then save into a house/face/credibility record.
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const url = await uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype);
        res.json({ url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

export default router;
