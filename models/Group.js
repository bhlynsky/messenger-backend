const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
        },
        groupPicture: {
            type: String,
        },
        members: {
            type: Array,
        },
        lastMessage: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);
