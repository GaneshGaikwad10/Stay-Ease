const { createBooking, getBookingsByuserId, updateBookingStatus } = require('../controllers/bookingController');
const Booking = require('../models/bookingModel');

//  mock Booking model so we don't hit the real database
jest.mock('../models/bookingModel');

describe('Booking Controller Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  //  Creating a Booking
  it('should create a booking successfully', async () => {
    req = { body: { userId: '123', hotelId: 'abc', status: 'Pending' } };
    
    //mock  .save() method of the model
    Booking.prototype.save = jest.fn().mockResolvedValue(req.body);

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Booking created Successfully'
    }));
  });

  // Getting Bookings by User ID
  it('should get bookings for a specific user', async () => {
    req = { params: { userId: 'user123' } };
    const mockBookings = [{ bookingId: 'b1', userId: 'user123' }];
    
    // Mock static find method
    Booking.find.mockResolvedValue(mockBookings);

    await getBookingsByuserId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBookings);
  });

  // Updating Status (Success Case)
  it('should update booking status successfully', async () => {
    req = { 
      params: { bookingId: 'b1' },
      body: { status: 'Confirmed' } 
    };
    
    // updateOne to say 1 document was matched
    Booking.updateOne.mockResolvedValue({ matchedCount: 1 });

    await updateBookingStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking status updated successfully...' });
  });

  // Updating Status (Invalid Status Case)
  it('should return 400 for an invalid status update', async () => {
    req = { 
      params: { bookingId: 'b1' },
      body: { status: 'InvalidStatusName' } 
    };

    await updateBookingStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Update failed, Enter valid status..." });
  });
});