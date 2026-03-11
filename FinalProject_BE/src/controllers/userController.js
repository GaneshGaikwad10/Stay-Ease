const User = require('../models/userModel.js');
const asyncHandler = require('../middleware/asyncHandler');

// Get all users (Admin only)
const getUserD = asyncHandler(async (req, res) => {
    const allUsers = await User.find().select('-password');
    res.status(200).json({ success: true, count: allUsers.length, data: allUsers });
});

// Get single user profile
const getProfile = asyncHandler(async (req, res) => {
    
    /**
     If the ID parameter is 'me', use the ID from the secure cookie (req.user.userId).
     * Otherwise, use the ID provided in the URL parameter.
     */
    const targetId = req.params.id === 'me' || !req.params.id ? req.user.userId : req.params.id;

    const user = await User.findById(targetId).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ success: true, data: user });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {

    // Use req.user.userId if route is '/me', else use the URL parameter
     const targetId = req.params.id === 'me' || !req.params.id ? req.user.userId : req.params.id;

    // Check Is the logged in user updating themself or are they an admin?
    if (req.user.userId !== targetId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "You are not authorized to update this profile" });
    }
    
    const user = await User.findByIdAndUpdate(targetId, req.body, {
        returnDocument: 'after', // Returns the updated document
        runValidators: true
    }).select('-password');

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Profile updated!", data: user });
});

// Delete user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    //Prevent Admin from deleting their own account accidentally
    if (user._id.toString() === req.user.userId) {
        return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User permanently removed from system" });
});

module.exports = { getUserD, getProfile, updateProfile, deleteUser };