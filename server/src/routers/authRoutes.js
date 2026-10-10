import express from 'express';
import { 
    registerAdmin,
    loginUser,
    logoutUser,
    getCurrentUser,
    uploadProfilePhoto,
    removeProfilePhoto,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser);
router.patch("/profile/photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);
router.delete("/profile/photo", authMiddleware, removeProfilePhoto);

export default router;

