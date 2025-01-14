const { required } = require('joi');
const mongoose = require('mongoose');

const productivitySchema = new mongoose.Schema({
    totalAssignedTasks: {
        type: Number,
        required: false,
        default: 0
    },
    totalCompletedTasks: {
        type: Number,
        required: false,
        default: 0
    },
    totalUncompletedTasks: {
        type: Number,
        required: false,
        default: 0
    },
    totalproductivity :{
        type: String,
        required :false,
        deafault : "100%"
    }

}, { timestamps: true });

const productivityModel = mongoose.model('Productivity', productivitySchema);

module.exports = productivityModel; 