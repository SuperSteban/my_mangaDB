const multer = require('multer')
const path = require('path');


const storage = multer.diskStorage(
    {
        destination: 'uploads/',
        filename: (req: Request, file: any, cb: any) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    }
);

export const upload = multer(
    {
        storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req: Request, file: any, cb: any) => {
            if (!file.mimetype.startsWith("image/")) {
                return cb(new Error("Only images are allow"))
            }
            cb(null, true)

        },

    });