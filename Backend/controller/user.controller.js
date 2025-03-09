const { userModel, validateUserModel } = require('../models/user.model');
const  redisClient  = require('../service/redis.service');
const  { hashPassword, comparePassword } = require('../utils/hash-password');
const { createToken, verifyToken } = require('../utils/jwt');
const userService = require('../service/user.service');


const signupController = async (req, res) => {

    try {
        const { error } = validateUserModel(req.body);
        let imageUrl;
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, email, phone, password } = req.body;
    if (req.files.length >0) {
        imageUrl = req.files[0].publicUrl;
        
    }
    else{
        imageUrl= "https://storage.googleapis.com/ecommerce-ab165.appspot.com/default-profile19460541f53.png"
    }
        const existingUser = await userService.findUserByEmail(email);

        if(existingUser){
           return res.status(500).json({ error: 'User with this data exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await userService.createUserService({ username, email, phone, password:hashedPassword ,profileimg:imageUrl });

        const token = await createToken({ id: user._id, email: user.email });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000,
          });
          
        res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined }, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred during registration', details: err.message });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await userService.findUserByEmail(email)
        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = await createToken({ id: user._id, email: user.email });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: { ...user.toObject(), password: undefined },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        let imageUrl;

        const user = await userService.findUserById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        
        if (req.files && req.files.length > 0) {
            imageUrl = req.files[0].publicUrl;
        } else {
            imageUrl = user.profileimg;
        }
        
       
        const updatedUser = await userService.updateUserService(req.user.id, {
            username: username || user.username,
            email: email || user.email,
            phone: phone || user.phone,
            profileimg: imageUrl
        });

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: { ...updatedUser.toObject(), password: undefined } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating profile', details: err.message });
    }
};


const profileController = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userdata = await userService.findUserByEmail(user.email).then(userdata => userdata.populate('tasks'));
        

        if (!userdata.username || !userdata.email || !userdata.phone) {
            return res.status(400).json({ error: 'Incomplete user profile data' });
        }

        delete userdata.password;

        res.status(200).json({
            message: 'User profile fetched successfully',
            user: userdata
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const logoutController = async (req, res) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided. Logout failed.",
            });
        }

        await redisClient.set(token, "logout", "EX", 5 * 60 * 60);

        res.clearCookie('authToken', { httpOnly: true, secure: true });

        res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

        req.user = null;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getAllUserController = async (req, res) => {
    try {
        const loggedInUser = req.user; 
        const allUsers = await userService.findAllUsers();

        // Filter out the logged-in user
        const filteredUsers = allUsers.filter(user => user._id.toString() !== loggedInUser._id.toString());

        res.json({ success: true, users: filteredUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getUserByIdController = async (req,res) => {
    try {
        const id = req.params.id;
    if(!id){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    const user = await userService.findUserById(id);
    res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }


}

module.exports = {loginController,signupController,profileController,logoutController,getAllUserController,getUserByIdController,updateProfileController};
