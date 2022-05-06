import multer from "multer";

const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 //limit 10mb for storage
    }
});

export default multerUpload;