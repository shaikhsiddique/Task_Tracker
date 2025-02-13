const notificationService = require('../service/notification.service');
const userService = require('../service/user.service');

const createNotification = async (req, res) => {
    try {
        const {  receiver, type, data } = req.body;
        let sender = req.user.username;

        if (!sender || !receiver || !type || !data) {
            return res.status(400).json({ error: "Missing required fields: sender, receiver, type, or data" });
        }

        const notification = await notificationService.createNotification({ sender, receiver, type, data });
        await userService.addNotification(receiver, notification._id);
        return res.status(201).json(notification);
    } catch (error) {
        console.error("Error in createNotification:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.findAllNotifications();
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Notification ID is required" });
        }

        const notification = await notificationService.findNotificationById(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        return res.status(200).json(notification);
    } catch (error) {
        console.error("Error fetching notification by id:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Notification ID is required" });
        }

        const notification = await notificationService.deleteNotification(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        await userService.removeNotification(notification.user, notification._id);
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

const setIsNew = async (req, res) => {
    try {
        let id = req.params.id;

        let notification = await notificationService.setIsNew(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification updated successfully", notification });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
const setMarked = async (req, res) => {
    let id = req.params.id;
    try {
        const notification = await notificationService.setMarked(id);
        res.status(200).json({ success: true, message: "Notification marked successfully", data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error marking notification", error: error.message });
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    setIsNew,
    setMarked
};
