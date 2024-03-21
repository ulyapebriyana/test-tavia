import multer, { diskStorage } from 'multer';
import fs from 'fs';
import { errorClientHandler } from '../helpers/response-handler.js';

const storage = diskStorage({
    destination: (req, file, cb) => {
        const directory = `uploads/${req.currentEmployee.id} - ${req.currentEmployee.fullName}/`
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        cb(null, directory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const files = req.files;
        const errors = [];

        files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        });

        if (errors.length > 0) {
            files.forEach((file) => {
                fs.unlinkSync(file.path);
            });

            return errorClientHandler(res, 400, errors)
        }

        req.files = files;

        next();
    });
};

export default uploadMiddleware;