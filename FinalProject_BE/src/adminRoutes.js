const express = require('express');
const { getUserD } = require('../controllers/userController');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/users', verifyToken, authorizeRoles('admin'), getUserD);

module.exports = router;