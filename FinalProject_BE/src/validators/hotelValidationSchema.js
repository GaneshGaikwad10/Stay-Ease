const { checkSchema } = require('express-validator');
 
const hotelValidationSchema = checkSchema({
  // 1. hotelId
  hotelId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Hotel Id is required' },
    isString: { errorMessage: 'Hotel Id must be a string' },
    trim: true,
    uppercase: true
  },
 
  // 2. managerId
  managerId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Manager Id is required' },
    trim: true
  },
 
  // 3. name
  name: {
    in: ['body'],
    notEmpty: { errorMessage: "Hotel Name is required" },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Hotel name must be between 3 and 100 characters"
    },
    trim: true
  },
 
  // 4. location
  location: {
    in: ['body'],
    notEmpty: { errorMessage: 'Location is required' },
    trim: true
  },
 
  // 5. address
  address: {
    in: ['body'],
    notEmpty: { errorMessage: 'Physical address is required' },
    trim: true
  },
 
  // 6. description
  description: {
    in: ['body'],
    optional: true,
    isString: { errorMessage: 'Description must be a string' }
  }, 
 
  // 7. rating
  rating: {
    in: ['body'],
    optional: true,
    isFloat: {
      options: { min: 0, max: 5 },
      errorMessage: 'Rating must be between 0 and 5'
    }
  },
 
  amenities: {
    in: ['body'],
    isArray: { errorMessage: "Amenities must be an array of strings" },
    optional: true
  },
 
  // 8. grade
  grade: {
    in: ['body'],
    optional: true,
    custom: {
      options: (value) => value === null || typeof value === 'number',
      errorMessage: 'Grade must be a number or null'
    }
  },
 
  // 10. image
  image: {
    in: ['body'],
    optional: true,
    isString: { errorMessage: 'Image path must be a string' }
  },
 
  // 11. rooms (Main Array)
  rooms: {
    in: ['body'],
    isArray: {
      options: { min: 1 },
      errorMessage: "At least one room must be defined"
    }
  },
 
  // 12. Nested Room Fields
  'rooms.*.roomId': {
    in: ['body'],
    notEmpty: { errorMessage: "Each room must have a roomId" }
  },
 
  'rooms.*.type': {
    in: ['body'],
    isIn: {
      options: [['Standard', 'Deluxe', 'Executive', 'Suite', '']],
      errorMessage: "Invalid room type"
    }
  },
 
  'rooms.*.price': {
    in: ['body'],
    isNumeric: { errorMessage: "Room price must be a number" },
    custom: {
      options: (value) => value >= 0,
      errorMessage: "Price cannot be negative"
    }
  },
 
  'rooms.*.capacityAdults': {
    in: ['body'],
    isNumeric: { errorMessage: "Adult capacity must be a number" }
  },
 
  'rooms.*.capacityChildren': {
    in: ['body'],
    isNumeric: { errorMessage: "Children capacity must be a number" },
    optional: true
  },
 
  'rooms.*.status': {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['Available', 'Occupied', 'Maintenance', '']],
      errorMessage: "Invalid room status"
    }
  },
  'rooms.*.features': {
  in: ['body'],
  optional: true,
  custom: {
    options: (value) => {
      // Must be an array AND every item must be a string
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
        throw new Error("Features must be an array of strings");
      }
      return true;
    }
  }
},
  'rooms.*.unavailableDates': {
  in: ['body'],
  optional: true,
  custom: {
    options: (value) => {
      // Updated to use '-' to match your data: 2026-01-20
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
     
      if (!Array.isArray(value) || !value.every(date => dateRegex.test(date))) {
        throw new Error("Must be an array of dates in YYYY-MM-DD format");
      }
      return true;
    }
  }
}
});
 
module.exports = hotelValidationSchema;