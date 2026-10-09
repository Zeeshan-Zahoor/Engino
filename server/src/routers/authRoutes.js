import express from 'express';
import { 
    registerAdmin,
    loginUser,
    logoutUser,
    getCurrentUser,
    uploadProfilePhoto,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser);
router.patch("/profile/photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);

export default router;

