import multer from 'multer';
import path from 'path';
import { avatarFileSchema } from '../schemas/authSchemas.js';

const tempDir = path.resolve('temp');

const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage: multerConfig,
    fileFilter: avatarFileSchema.fileFilter,
    limits: avatarFileSchema.limits,
});
