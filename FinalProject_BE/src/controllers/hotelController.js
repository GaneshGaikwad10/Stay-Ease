

const hotels = require('../models/hotelModel')

exports.getAllHotels = (async (req, res, next) => {
  try {
    const allHotels = await hotels.find();
    res.status(201).json({ data: allHotels });
  }
  catch (err) {
    next(err);
  }
})

exports.getHotelById = (async (req, res, next) => {
  try {
    const hotel = await hotels.findOne({ hotelId: req.params.id });
    if (!hotel)
      return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
});



exports.getHotelsByManagerId = async (req, res, next) => {
  try {
    const managerId = String(req.params.id);
    const list = await hotels.find({ managerId });
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};




exports.deleteRoom = async (req, res, next) => {
  try {
    const { hotelId, roomId } = req.params;

    // Find the hotel and pull (remove) the room from the rooms array
    const updatedHotel = await hotels.findOneAndUpdate(
      { hotelId: hotelId },
      { $pull: { rooms: { roomId: roomId } } },
      { new: true } // returns the updated document
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Room deleted successfully", data: updatedHotel });
  } catch (err) {
    next(err);
  }
};





exports.createNewHotel = async (req, res, next) => {
  try {

    const hotelData = { ...req.body };


    if (typeof hotelData.amenities === 'string') {
      hotelData.amenities = JSON.parse(hotelData.amenities);
    }
    if (typeof hotelData.rooms === 'string') {
      hotelData.rooms = JSON.parse(hotelData.rooms);
    }


    if (req.file) {
      hotelData.image = `/uploads/${req.file.filename}`;
    }

    console.log("Final data to save:", hotelData);


    // Create and save to MongoDB
    const newHotel = new hotels(hotelData);
    const savedHotel = await newHotel.save();

    res.status(201).json({
      message: 'Added new hotel successfully',
      data: savedHotel
    });
  } catch (err) {
    console.error("Validation Error Details:", err.errors);
    next(err);
  }
};


exports.fullUpdateHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.id;

    req.body.hotelId = hotelId;

    const fullUpdateHotel = await hotels.replaceOne({ hotelId: hotelId }, req.body);
    if (!fullUpdateHotel) {
      return res.status(400).json({ message: "hotel is not found", data: fullUpdateHotel });

    }
    const updatedHotel = await hotels.findOne({ hotelId: hotelId });
    res.status(200).json(updatedHotel);
  }

  catch (err) {
    next(err);
  }
}


exports.deleteHotel = async (req, res, next) => {
  const hotelId = req.params.id;
  if (!hotelId) {
    res.status(400).json({ message: 'hotel is not found' })
  }
  else {
    await hotels.findOneAndDelete({ hotelId: hotelId });
    res.status(200).json({ message: "hotel deleted successfully" });
  }
}

exports.partialUpdateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id.trim();
    const data = req.body;


    const hotel = await hotels.findOne({ hotelId: req.params.id });

    if (!hotel) {
      console.log("DATABASE ERROR: No hotel found with ID:", hotelId);
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const { rooms, amenities, ...rest } = data;

    Object.assign(hotel, rest);//updating the hotel with the fields like name,location,address,grade




    if (amenities) {
      hotel.amenities = amenities;
    }


    //updating room
    if (rooms) {
      data.rooms.forEach(roomData => {
        const room = hotel.rooms.find(r => r.roomId === roomData.roomId);

        if (room) {
          const { unavailableDates, ...rest } = roomData;
          Object.assign(room, rest);

          
          if (unavailableDates) {
            room.unavailableDates = unavailableDates;
          }

          const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
          if (Array.isArray(unavailableDates) && unavailableDates.includes(today)) {
            room.status = 'Occupied';
          }

        }

        //adding new room      
        else {
          hotel.rooms.push(roomData);
        }
      });
    }

    await hotel.save(); // triggers validation

    res.json({ message: 'Hotel updated', hotel });

  } catch (err) {

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};



