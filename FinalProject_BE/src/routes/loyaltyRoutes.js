const express = require('express');
const router = express.Router();
const { getPoints, updatePoints} = require('../controllers/loyaltyController');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');

router.get('/:id',verifyToken, authorizeRoles('user'), getPoints);
router.patch('/:id', verifyToken, authorizeRoles('user'),updatePoints);


module.exports = router;
