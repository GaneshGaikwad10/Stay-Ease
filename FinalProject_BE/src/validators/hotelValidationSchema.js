const { checkSchema } = require('express-validator');
 
 const indianLocations = [
   'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Keralam', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
   'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
 ]
 
 
 
 
const hotelPatchSchema = checkSchema({

  hotelId: {
    in: ['body'],
    optional: true,
    isString: { errorMessage: 'Hotel Id must be a string' },
    trim: true
  },
  managerId: {
    in: ['body'],
    optional: true,
    isString: { errorMessage: 'Manager Id must be a string' },
    trim: true
  },
 
 
  name: {
    in: ['body'],
    optional: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: 'Hotel name must be between 3 and 100 characters'
    },
    custom: {
      options: (value) => {
        if (/(.)\1{4,}/.test(value)) throw new Error('Name contains too many repeated characters');
        return true;
      }
    },
    trim: true
  },
 
 
location: {
  in: ['body'],
  notEmpty: { errorMessage: 'Location is required' },
  trim: true,
  optional:true,
  custom: {
    options: (value) =>
      [
        'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
        'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
        'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
        'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
        'Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands',
        'Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Lakshadweep',
        'Delhi','Puducherry','Ladakh','Jammu and Kashmir'
      ]
      .map(s => s.toLowerCase())          // convert list to lowercase
      .includes(
        value.trim().replace(/\s+/g,' ').toLowerCase() // normalize user input
      ),
    errorMessage: 'Location must be a valid Indian State'
  }
},
 
 
  address: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { min: 10, max: 250 },
      errorMessage: 'Address must be at least 10 characters long'
    },
    custom: {
      options: (value) => {
        if (!value) return true;
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
          throw new Error('Address must contain both letters and numbers (e.g., Plot/Door No)');
        }
        if (/(.)\1{4,}/.test(value)) {
          throw new Error('Address contains invalid repeated characters');
        }
        return true;
      }
    }
  },
 
 
  description: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { min: 20, max: 1000 },
      errorMessage: 'Description should be between 20 and 1000 characters'
    },
    custom: {
      options: (value) => {
        if (!value) return true;
        if (value.length > 30 && !/[aeiouAEIOU]/.test(value)) {
          throw new Error('Description seems invalid or contains gibberish');
        }
        if (/(.)\1{5,}/.test(value)) {
          throw new Error('Description contains too many repeated characters');
        }
        if (/^\d+$/.test(value)) {
          throw new Error('Description cannot be only numbers');
        }
        return true;
      }
    }
  },
 
 
  rating: {
    in: ['body'],
    optional: true,
    isFloat: { options: { min: 0, max: 5 }, errorMessage: 'Rating must be between 0 and 5' }
  },
 
 
 amenities: {
  in: ['body'],
  optional: true,
 
  custom: {
    options: (value) => {
      // If it's a string (FormData case) -> try to parse
      if (typeof value === 'string') {
        try { value = JSON.parse(value); } catch {
          return false; // not valid JSON
        }
      }
 
      // Now it MUST be an array
      if (!Array.isArray(value)) return false;
 
      // And each item must be a string
      return value.every(v => typeof v === 'string');
    }
  },
  errorMessage: "Amenities must be an array of strings"
},
 
 
 grade: {
  in: ['body'],
  optional: true,
  custom: {
    options: (value) => {
      // Allow null or empty string
      if (value === '' || value === null || value === undefined) return true;
 
      // Convert FormData string → number
      if (typeof value === 'string') {
        value = Number(value);
      }
 
      // Now check number type
      return typeof value === 'number' && !isNaN(value);
    }
  },
  errorMessage: "Grade must be a number or null"
},
 
 
  image: {
    in: ['body'],
    optional: true,
    isString: { errorMessage: 'Image path must be a string' }
  },
 
 
 
 rooms: {
  in: ['body'],
  optional: true,
  custom: {
    options: (value) => {
      // Case 1: FormData sends string → try parsing it
      if (typeof value === 'string') {
        try { value = JSON.parse(value); } catch {
          return false;
        }
      }
 
      // Case 2: After parsing, MUST be an array
      return Array.isArray(value);
    }
  },
  errorMessage: 'Rooms must be an array'
},
  'rooms.*.roomId': {
    in: ['body'],
    isString: { errorMessage: 'roomId must be a string' },
    optional:true
  },
 
  'rooms.*.type': {
    in: ['body'],
    isIn: {
      options: [['Standard', 'Deluxe', 'Executive', 'Suite', '']],
      errorMessage: 'Invalid room type'
    },
    optional:true
  },
 
  'rooms.*.price': {
    in: ['body'],
    isNumeric: { errorMessage: 'Room price must be a number' },
    custom: { options: (value) => Number(value) >= 0, errorMessage: 'Price cannot be negative' },
    optional:true
  },
 
  'rooms.*.capacityAdults': {
    in: ['body'],
    isNumeric: { errorMessage: 'Adult capacity must be a number' },
    optional:true
  },
 
  'rooms.*.capacityChildren': {
    in: ['body'],
    isNumeric: { errorMessage: 'Children capacity must be a number' },
    optional:true
  },
 
 
 
  'rooms.*.status': {
  in: ['body'],
  optional: true,
  customSanitizer: {
    options: (v) => (v === undefined || v === null || v === '' ? 'Available' : v)
  },
  isIn: {
    options: [['Available', 'Occupied', 'Maintenance']],
    errorMessage: 'Invalid room status'
  }
},
 
  'rooms.*.features': {
    in: ['body'],
    optional: true,
    custom: {
      options: (value) => {
        const allowed = ['Mountain View', 'King Bed', 'Sea View', 'Queen Bed', 'Balcony', 'Work Desk'];
        if (!Array.isArray(value)) throw new Error('Features must be an array');
        const isValid = value.every((item) => allowed.includes(item));
        if (!isValid) throw new Error('One or more features are invalid');
        return true;
      }
    }
  },
 
  'rooms.*.unavailableDates': {
  in: ['body'],
  optional: true,
  custom: {
    options: (value) => {
      if (!Array.isArray(value)) throw new Error('Must be an array');
      const dateRegex = /^\d{4}-\d{2}-\d{2}(_MAINTENANCE)?$/;
      if (!value.every(d => typeof d === 'string' && dateRegex.test(d))) {
        throw new Error('Dates must be YYYY-MM-DD or YYYY-MM-DD_MAINTENANCE');
      }
      return true;
    }
  }
}
});
 
module.exports = hotelPatchSchema;