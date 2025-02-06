const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
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
    productivity :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productivity",
        default: null
    },
    notifications : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Notification",
        default : null
    }]
    
}, { timestamps: true });

const validateUserModel = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel, validateUserModel };
