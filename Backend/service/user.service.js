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

module.exports = { createUserService, findUserByEmail, findAllUsers };
