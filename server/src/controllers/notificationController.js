import Notification from "../models/notification.model.js";

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.find({
            recipient: userId,
        })
        .populate("actor", "name avatar")
        .populate("taskId", "title status")
        .populate("projectId", "name description")
        .sort({ createdAt: -1 })
        .limit(30);

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
}

const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: userId,
            },
            { $set: { isRead: true } },
            { returnDocument: "after" }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message,
        });
    }
}

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            {
                recipient: userId,
                isRead: false,
            },
            {
                $set: { isRead: true },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read",
            error: error.message,
        });
    }
}

export {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
}