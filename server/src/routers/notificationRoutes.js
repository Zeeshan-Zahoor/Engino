import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);
router.patch("/:notificationId/read", authMiddleware, markNotificationAsRead);

export default router;
