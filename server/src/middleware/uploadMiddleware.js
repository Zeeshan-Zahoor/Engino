import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "images/jpeg",
            "images/png",
            "images/webp",
        ];

        if(!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only JPG, PNG, and WEBP images are allowed.")
            );
        }

        cb(null, true);
    },
});

export default upload;