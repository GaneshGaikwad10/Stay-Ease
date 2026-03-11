
const express = require('express');
const router = express.Router();
const { getReviewsByHotel, addReview } = require('../controllers/reviewController');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');

router.get('/:id', verifyToken, authorizeRoles('user'),getReviewsByHotel);
router.post('/', verifyToken, authorizeRoles('user'), addReview);

module.exports = router;
