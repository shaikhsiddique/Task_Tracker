const mongoose = require('mongoose');
const Joi = require('joi');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
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

const Workspace = mongoose.model('Workspace', workspaceSchema);

const validateWorkspace = (workspace) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        members: Joi.array().items(Joi.string()).optional(),
        admin: Joi.string().required(),
        attachment: Joi.string().allow(null),
        chat: Joi.array().items(Joi.object({
            message: Joi.string().required(),
            sender: Joi.string().email().required()
        })).optional()
    });
    return schema.validate(workspace);
};

module.exports = { Workspace, validateWorkspace };
