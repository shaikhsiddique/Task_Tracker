const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    attachment: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    tag : {
        type:String,
    }
});

const Task = mongoose.model('Task', taskSchema);

const validateTask = (task) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        assignedTo: Joi.required(),
        assignedAt: Joi.date().default(Date.now),
        deadline: Joi.required(),
        tag: Joi.string().required(),
        attachment: Joi.string().allow(null),
        status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending')
    });
    return schema.validate(task);
};

module.exports = { Task, validateTask }; 