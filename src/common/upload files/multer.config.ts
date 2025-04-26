import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';

interface MulterOptions {
    uploadPath: string;
    allowedExt: string[];
}

export const multerConfig = ({ uploadPath = 'Generals', allowedExt }: MulterOptions) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Resolve the upload path to an absolute path
            const destPath = path.resolve(__dirname, 'uploads', uploadPath);

            // Create the directory if it does not exist
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }

            // Set the destination to the dynamically created folder
            cb(null, destPath);
        },
        filename: function (req, file, cb) {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExt.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    };

    return { storage, fileFilter };
};
