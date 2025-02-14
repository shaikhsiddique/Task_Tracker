const { notificationModel } = require("../models/notification.model");

const createNotification = async (data) => {
    try {
        if (!data.sender || !data.receiver || !data.type || !data.data) {
            throw new Error("Missing required fields: sender, receiver, type, or data");
        }
        
        let message ;

        switch (data.type) {
            case 'request':
                if (!data.data.workspace) {
                    throw new Error("Missing workspace information for join request");
                }
                let workspace = (data.data.workspace.name)
               
                message = `${data.sender} has requested to join workspace ${workspace}`;
                break;
            case 'notification':
                message = data.message;
                if (data.data.message) {
                    message = data.data.message
                }
                break;
            case 'alarm':
                message = `${data.sender} triggered an alarm`;
                break;
            default:
                throw new Error("Invalid notification type");
        }

        const notification = await notificationModel.create({
            user: data.receiver,
            message,
            data: data.data,
            type: data.type
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error.message);
        throw error;
    }
};

const findAllNotifications = async () => {
    try {
        return await notificationModel.find().populate("user"); // Populating user details
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        throw error;
    }
};


const findNotificationById = async (id) => {
    try {
        const notification = await notificationModel.findById(id).populate("user");
        if (!notification) {
            throw new Error("Notification not found");
        }
        return notification;
    } catch (error) {
        console.error("Error finding notification:", error.message);
        throw error;
    }
};

const setIsNew = async (id) => {
    try {
        const notification = await notificationModel.findByIdAndUpdate(id, { isNew: false });
        if (!notification) {
            throw new Error("Notification not found");
        }
        return notification;
    } catch (error) {
        console.error("Error setting notification as new:", error.message);
        throw error;
    }
}

const setMarked = async (id) => {
    try {
        const notification = await notificationModel.findByIdAndUpdate(id, { isMarked: true });
        if (!notification) {
            throw new Error("Notification not found");
        }
        
    } catch (error) {
        console.error("Error marking notification:", error.message);
        throw error;
    }
}

const deleteNotification = async (id) => {
    try {
        const notification = await notificationModel.findByIdAndDelete(id);
      if (!notification) {
            throw new Error("Notification not found");
        }
        return notification;
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        throw error;
    }
};

module.exports = { createNotification ,findAllNotifications,findNotificationById,deleteNotification ,setIsNew , setMarked};
