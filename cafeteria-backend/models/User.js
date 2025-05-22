const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {type: String, trim: true},
    phone: {type: String, trim: true},
    profilePictureUrl: {type: String, trim: true},
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;