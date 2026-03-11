
const express = require('express');
const router = express.Router();

const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');

//controllers
const {createBooking, getBookingsByuserId, getBookingsByhotelId, updateBookingStatus, getBookingsBybookingId, getBookingsByManager} = require('../controllers/bookingController');

//Booking Routes

router.post('/',verifyToken,authorizeRoles('user'),createBooking);
router.get('/user/:userId',verifyToken, authorizeRoles('user'), getBookingsByuserId);  //by userId
router.get('/hotel/:hotelId',verifyToken, authorizeRoles('user'),getBookingsByhotelId); //by hotelId
router.get('/:bookingId', verifyToken, authorizeRoles('user'),getBookingsBybookingId); //by bookingId
router.patch('/status/:bookingId',verifyToken, authorizeRoles('user', 'hotel manager'),updateBookingStatus);
router.get('/manager/:managerId', verifyToken, authorizeRoles('user', 'hotel manager'),getBookingsByManager);


module.exports = router;