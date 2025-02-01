const mongoose = require('mongoose');
const Joi = require('joi');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User    "
    }
});

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachment: {
        type: String,
        default: null
    },
    chat: [chatSchema]
});

const workspaceModel = mongoose.model('Workspace', workspaceSchema);

const validateWorkspace = (workspace) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        members: Joi.array().items(Joi.string()).optional(),
        admin: Joi.required(),
        attachment: Joi.string().allow(null).optional(),
        chat: Joi.array().items(Joi.object({
            message: Joi.string().required(),
            sender: Joi.string().email().required()
        })).optional()
    });
    return schema.validate(workspace);
};

module.exports = { workspaceModel, validateWorkspace };
