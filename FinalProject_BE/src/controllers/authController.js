
const User = require('../models/userModel.js');
const RevokedToken = require('../models/revokedTokenSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../middleware/asyncHandler.js');

const registerUser = asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const normalizedRole = role ? role.toLowerCase() : 'user';
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const newUser = new User(req.body);
    newUser.role = normalizedRole;

    if (normalizedRole === 'hotel manager') {
        newUser.isActive = false;
    } else {
        newUser.isActive = true; 
    }
    await newUser.save();
 
    res.status(201).json({ 
        success: true, 
        message: "Registration successful! Awaiting approval.", 
        data: { id: newUser._id, email: newUser.email } 
    });
});


const loginhandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please enter both email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const jti = uuidv4();
    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role, jti: jti },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Cookie Approach: Set Secure Cookie options
    const cookieOptions = {
        httpOnly: true, // Prevents XSS attacks
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'Strict' // CSRF protection
    };

    res.status(200)
       .cookie('token', token, cookieOptions) //  Send via cookie
       .json({
            success: true,
            message: "Login successful",
            data: { id: user._id, email: user.email, role: user.role, isActive: user.isActive }
       });
});



const revokeToken = asyncHandler(async (req, res) => {
    const { jti } = req.user; 
    await RevokedToken.create({ jti });
    
    // Clear the cookie on logout
    res.clearCookie('token'); 
    res.status(200).json({ success: true, message: "Logout successful" });
});

module.exports = { registerUser, loginhandler,revokeToken };