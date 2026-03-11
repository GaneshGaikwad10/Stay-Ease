 
const express=require('express');
const router=express.Router();
 
const { validationResult }=require('express-validator');
const hotelValidationSchema = require('../validators/hotelValidationSchema.js');
const {verifyToken, authorizeRoles} = require('../middleware/authMiddleware');

const {createNewHotel}=require('../controllers/hotelController.js');
 
router.post('/schema',verifyToken, authorizeRoles('hotel manager'),hotelValidationSchema,async(req ,res,next)=>{
    const validationErrors=validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(400).json({statusCode:400,errors:validationErrors.array()})
    }
    else{
        await createNewHotel(req,res,next);
    }
})
 
module.exports=router;