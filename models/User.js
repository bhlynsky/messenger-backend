const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        accessLevel: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
