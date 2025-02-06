const {userModel} = require('../models/user.model');


const createUserService = async (data) => {
    const { username, email, phone, password , profileimg } = data;

    if (!username || !email || !phone || !password || !profileimg) {
        throw new Error('All fields are required');
    }

    try {
        const user = await userModel.create({
            username,
            email,
            phone,
            password,
            profileimg
        });
        return user;
    } catch (err) {
        throw new Error('Error creating user: ' + err.message);
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({email})
        return user;
    } catch (err) {
        throw new Error('Error finding user: ' + err.message);
    }
};

const findAllUsers = async () => {
    try {
        const users = await userModel.find();
        return users;
    } catch (err) {
        throw new Error('Error fetching users: ' + err.message);
    }
};

const addWorkspace = async (userId, workspaceId) => {
    try {
        if (!userId || !workspaceId) {
            throw new Error("User ID and Workspace ID are required");
        }

        let user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.workspace.includes(workspaceId)) {
            user.workspace.push(workspaceId);
            await user.save();
        }

        return user;
    } catch (err) {
        console.error("Error adding workspace:", err);
        throw new Error("Error adding workspace: " + err.message);
    }
};

const removeWorkspace = async (userId, workspaceId) => {
    try {
        if (!userId || !workspaceId) {
            throw new Error("User ID and Workspace ID are required");
        }

        let user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const workspaceIndex = user.workspace.indexOf(workspaceId);
        if (workspaceIndex === -1) {
            throw new Error("Workspace not found in user's list");
        }

        user.workspace.splice(workspaceIndex, 1);
        await user.save();

        return user;
    } catch (err) {
        console.error("Error removing workspace:", err);
        throw new Error("Error removing workspace: " + err.message);
    }
};
const addNotification = async (userId, notificationId) => {
    try {
        if (!userId || !notificationId) {
            throw new Error("User ID and Notification ID are required");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Optionally, check if the notification already exists to prevent duplicates
        if (user.notifications.includes(notificationId)) {
            throw new Error("Notification already exists in the user's list");
        }

        user.notifications.push(notificationId);
        await user.save();

        return user;
    } catch (err) {
        console.error("Error adding notification:", err);
        throw new Error("Error adding notification: " + err.message);
    }
};

const removeNotification = async (userId, notificationId) => {
    try {
        if (!userId || !notificationId) {
            throw new Error("User ID and Notification ID are required");
        }
        console.log(userId,notificationId)

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const notificationIndex = user.notifications.indexOf(notificationId);
        if (notificationIndex === -1) {
            throw new Error("Notification not found in user's list");
        }

        user.notifications.splice(notificationIndex, 1);
        await user.save();

        return user;
    } catch (err) {
        console.error("Error removing notification:", err);
        throw new Error("Error removing notification: " + err.message);
    }
};




module.exports = { createUserService, findUserByEmail, findAllUsers , addWorkspace ,removeWorkspace ,addNotification ,removeNotification };
