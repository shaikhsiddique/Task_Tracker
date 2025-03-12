const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."]
    },
    phone: {
        type: Number,
        unique: true,
        required: [true, "Phone number is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    profileimg: {
        type: String,
        default: null
    },
    workspace: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null
        }
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null
        }
    ],
    productivity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productivity",
        default: null
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        default: null
    }]
}, { timestamps: true });

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern.email) {
            next(new Error('Email must be unique. The provided email is already in use.'));
        } else if (error.keyPattern.phone) {
            next(new Error('Phone number must be unique. The provided phone number is already in use.'));
        } else {
            next(new Error('A unique constraint violation occurred.'));
        }
    } else {
        next(error);
    }
});

const validateUserModel = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.base": "Username must be a valid string.",
                "string.empty": "Username cannot be empty. Please enter a username.",
                "string.min": "Username must be at least 3 characters long.",
                "string.max": "Username cannot exceed 50 characters.",
                "any.required": "Username is required."
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Please provide a valid email address.",
                "string.empty": "Email cannot be empty. Please enter your email.",
                "any.required": "Email is required."
            }),
        phone: Joi.number()
            .integer()
            .min(1000000000)
            .max(9999999999)
            .required()
            .messages({
                "number.base": "Phone number must be a valid number.",
                "number.integer": "Phone number must be an integer.",
                "number.min": "Phone number must be a 10-digit number.",
                "number.max": "Phone number must be a 10-digit number.",
                "any.required": "Phone number is required."
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": "Password must be a valid string.",
                "string.empty": "Password cannot be empty. Please enter a password.",
                "string.min": "Password must be at least 6 characters long.",
                "any.required": "Password is required."
            })
    });

    return schema.validate(data, { abortEarly: false });
};

const userModel = mongoose.model('User', userSchema);
module.exports = { userModel, validateUserModel };
