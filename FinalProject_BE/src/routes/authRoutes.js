const express = require('express');
const { registerUser, loginhandler, revokeToken } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
 
const router = express.Router();
 
router.post('/register', registerUser);
router.post('/login', loginhandler);
router.post('/logout', verifyToken, revokeToken);
 
module.exports = router;