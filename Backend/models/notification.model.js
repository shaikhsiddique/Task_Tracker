const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    isNew: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    isMarked: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    type: {
        type: String,
        enum: ['request', 'notification', 'alarm'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = { notificationModel };
