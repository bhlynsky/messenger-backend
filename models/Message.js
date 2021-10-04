const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        groupId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        senderName: {
            type: String,
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
