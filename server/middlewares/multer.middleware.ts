import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, './server/public/temp');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });
