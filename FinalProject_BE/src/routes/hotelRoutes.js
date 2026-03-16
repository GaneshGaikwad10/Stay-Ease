
const express = require('express');
const routes = express.Router();
const upload = require('../middleware/upload.middleware');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');
 
const {getAllHotels,getHotelById,createNewHotel,partialUpdateHotel,fullUpdateHotel,deleteHotel,  getHotelsByManagerId,deleteRoom} = require('../controllers/hotelController');

const {validate} = require('../middleware/validationMiddleware');
const hotelValidationSchema = require('../validators/hotelValidationSchema');
 
routes.post('/', verifyToken, authorizeRoles('hotel manager'),upload.single('image'),hotelValidationSchema, validate,createNewHotel);            
routes.get('/', verifyToken, authorizeRoles('user','hotel manager'),getAllHotels);
routes.get('/:id', verifyToken, authorizeRoles('user','hotel manager'), getHotelById);
routes.delete('/deleteRoom/:hotelId/:roomId', verifyToken, authorizeRoles('hotel manager'),deleteRoom);
routes.get('/manager/:id', verifyToken, authorizeRoles('hotel manager'),getHotelsByManagerId)
routes.patch('/updateHotel/:id', verifyToken, authorizeRoles('hotel manager'),hotelValidationSchema,validate,partialUpdateHotel);
routes.put('/:id', verifyToken, authorizeRoles('user','hotel manager'),fullUpdateHotel);
routes.delete('/delete/:id', verifyToken, authorizeRoles('hotel manager'),deleteHotel);

 
 
module.exports = routes;