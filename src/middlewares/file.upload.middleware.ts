const multer  = require('multer')


const storage = multer.diskStorage(
    {
        dest:'./uploads'
    }
);

export const upload = multer(
    { 
        storage,
        limits: { fileSize: 5 * 1024 * 1024},
        fileFilter: (req: Request, file: any, cb:any) => {
            if(!file.mimetype.startsWith("image/")){
                return cb(new Error("Only images are allow"))
            }
            cb(null, true)
        
        },
    });