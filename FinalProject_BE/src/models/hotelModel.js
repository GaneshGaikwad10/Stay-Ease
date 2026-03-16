const mongoose = require('mongoose');
const reviewSchema = require('./reviewSchema');


// 1. ROOM SCHEMA (Embedded)
const RoomSchema = new mongoose.Schema({
  roomId:
  {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Executive', 'Suite', ''],
    default: ''
  },

  price: {
    type: Number,
    required: true
  },

  capacityAdults: {
    type: Number,
    required: true
  },

  capacityChildren: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },

  features: [String],

  unavailableDates: [String]
});


const HotelSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    unique: true
  },

  managerId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },

  location: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  description: String,

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },


  amenities: [String],

  grade: {
    type: Number,
    default: null
  },


  image: String,

  rooms: [RoomSchema],

  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('hotel', HotelSchema);