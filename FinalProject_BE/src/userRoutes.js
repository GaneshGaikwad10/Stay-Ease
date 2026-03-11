const express = require('express');
const { getProfile, updateProfile,deleteUser } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verifyToken, getProfile);
router.patch('/me', verifyToken, updateProfile);

router.get('/:id', verifyToken ,authorizeRoles('admin','user'), getProfile);
router.patch('/:id', verifyToken, authorizeRoles('admin'), updateProfile);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

module.exports = router;