
const mongoose = require('mongoose');

const bookingRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, trim: true},
  type: { type: String, required: true, trim: true },
  price: { type: Number, required: true},
  quantity: { type: Number, required: true }
});


const bookingSchema = new mongoose.Schema({
  // bookingId: { type: String, required: true, unique: true, trim: true},
  userId: { type: String, required: true, trim: true },
  hotelId: { type: String, required: true, trim: true},
  rooms: { type: [bookingRoomSchema], required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  nights: { type: Number, required: true },
  totalAmount: {type: Number, required: true},
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled','Rejected'], 
    default: 'Pending',
    trim: true
  },
  paymentId: { type: String, default: null, trim: true }
}, { timestamps: true });


module.exports = mongoose.model('booking', bookingSchema);
