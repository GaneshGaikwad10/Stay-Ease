const express = require('express');
const router = express.Router();
const { searchHotel } = require('../controllers/searchController');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');

// search route
router.post('/', verifyToken, authorizeRoles('user'),searchHotel);

module.exports = router;
