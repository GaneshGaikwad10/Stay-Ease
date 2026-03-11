
const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');

//Create Booking entry
exports.createBooking = async(req, res, next)=>{
    try{
        const bookingData = req.body;
        
        const booking = new Booking(bookingData);
        await booking.save();

        res.status(201).json(
            {
                success: true,
                message: 'Booking created Successfully',
                data: booking
            } 
        );

    }catch(err){ 
        next(err);
    }
}

//Get bookings by userId
exports.getBookingsByuserId = async(req, res, next)=>{
    try{
        let userId = req.params.userId;
        const bookings = await Booking.find({userId: userId});
        res.status(200).json(bookings);

    }catch(err){
        next(err);
    }
}

//Get bookings by hotelId
exports.getBookingsByhotelId = async(req, res, next)=>{
    try{
        let hotelId = req.params.hotelId;
        const bookings = await Booking.find({hotelId: hotelId});
        res.status(200).json(bookings);

    }catch(err){
        next(err);
    }
}

//Get bookings by bookingId
exports.getBookingsBybookingId = async(req, res, next)=>{
    try{
        let bookingId = req.params.bookingId;
        const booking = await Booking.find({_id: bookingId});
        res.status(200).json(booking);

    }catch(err){
        next(err);
    }
}

//Change Status: booking - 'Confirmed', 'Completed', 'Cancelled'
exports.updateBookingStatus = async(req, res, next)=>{
    try{
        let bookingId = req.params.bookingId;
        let status = req.body.status;
        let validStatus = ['Pending', 'Confirmed', 'Completed', 'Cancelled','Rejected'];

        if(!validStatus.includes(status)){
            return res.status(400).json({message: "Update failed, Enter valid status..."})
        }

        const updatedBooking = await Booking.updateOne(
            { _id: bookingId }, 
            { $set: { status: status } }
        );


        if(updatedBooking.matchedCount === 0){
           return res.status(404).json({message: 'Booking not found for user'})
        }

        res.status(200).json({message: 'Booking status updated successfully...'});

    }catch(err){
        next(err);
    }
}


//get Bookings by Manager using managerId
exports.getBookingsByManager = async (req, res, next) => {
  try {
    const managerId = String(req.params.managerId);
    const managedHotels = await Hotel.find({ managerId: managerId });
 
    if (managedHotels.length === 0) 
        return res.status(200).json([]);
 
    
    const hotelIds = managedHotels.map(h => h.hotelId.trim());
 
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } });
 
    console.log(`Searching for bookings matching: ${hotelIds}`);
    console.log(`Found ${bookings.length} bookings.`);
 
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};
 
 