const express =require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', 'uploads', 'profile-pictures');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypesRegex = /jpeg|jpg|png|gif/;
    const extname = filetypesRegex.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypesRegex.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

router.get('/profile', protect, async (req, res) => {
    if (req.user) {
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            name: req.user.name,
            phone: req.user.phone,
            profilePictureUrl: req.user.profilePictureUrl,
            createdAt: req.user.createdAt,
        });
    } else {
        res.status(401).json({ message: 'User not found' });
    }
});

router.put('/profile', protect, upload.single('profilePictureFile'), async (req, res) => {
    const { username, name, email, phone } =req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let usernameChanged = false;
        if (username && username.toLowerCase() !== user.username.toLowerCase()) {
            const existingUserWithUsername = await User.findOne({ username: username.toLowerCase() });
            if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Username already taken.' });
            }
            user.username = username;
            usernameChanged = true;
        }

        if (email && email.toLowerCase() !== user.email.toLowerCase()) {
            const existingUserWithEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email already in use by another account'});
            }
            user.email = email.toLowerCase();
        }

        user.name = name !== undefined ? name : user.name;
        user.phone = phone !== undefined ? phone : user.phone;
        
        if (req.file) {
            user.profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
        } else if (req.body.profilePictureUrl !== undefined) {
            user.profilePictureUrl = req.body.profilePictureUrl;
        }

        const updatedUser = await user.save();
 
        const responsePayLoad = {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            profilePictureUrl: updatedUser.profilePictureUrl,
            message: 'Profile updated successfully',
          };

          if (usernameChanged) {
            const tokenPayLoad = {
                userId: updatedUser._id,
                username: updatedUser.username,
            };
            const newToken = jwt.sign(tokenPayLoad, JWT_SECRET, { expiresIn: '1h' });
            responsePayLoad.token = newToken;
          }
          res.json(responsePayLoad);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
});

router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    try{
        const  user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully!' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
});

module.exports = router;