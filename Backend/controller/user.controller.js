const { userModel, validateUserModel } = require('../models/user.model');
const  redisClient  = require('../service/redis.service');
const  { hashPassword, comparePassword } = require('../utils/hash-password');
const { createToken, verifyToken } = require('../utils/jwt');
const { createUserService, findUserByEmail, findAllUsers } = require('../service/user.service');


const signupController = async (req, res) => {

    try {
        const { error } = validateUserModel(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, email, phone, password } = req.body;

        const existingUser = await findUserByEmail(email);

        if(existingUser){
           return res.status(500).json({ error: 'User with this data exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await createUserService({ username, email, phone, password:hashedPassword });

        const token = await createToken({ id: user._id, email: user.email });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000,
          });

        res.status(201).json({ message: 'User created successfully', user: { id: user._id, username, email, phone },token });
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

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        console.log(password)
        console.log(user.password);
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
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const profileController = (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.username || !user.email || !user.phone) {
            return res.status(400).json({ error: 'Incomplete user profile data' });
        }

        res.status(200).json({
            message: 'User profile fetched successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
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

module.exports = {loginController,signupController,profileController,logoutController};
