const { getAllHotels, getHotelById, createNewHotel } = require('../controllers/hotelController');
const hotels = require('../models/hotelModel');

//  mock Hotel model to avoid real database calls
jest.mock('../models/hotelModel');

describe('Hotel Controller - Get and Add Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  // Get All Hotels
  it('should get all hotels successfully', async () => {
    const mockHotels = [{ name: 'Grand Stay', location: 'New York' }];
    hotels.find.mockResolvedValue(mockHotels);

    await getAllHotels(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: mockHotels });
  });

  //  Get Hotel By ID (Success)
  it('should get a specific hotel by ID', async () => {
    req = { params: { id: 'H101' } };
    const mockHotel = { hotelId: 'H101', name: 'Grand Stay' };
    hotels.findOne.mockResolvedValue(mockHotel);

    await getHotelById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHotel);
  });

  //  Get Hotel By ID (Not Found)
  it('should return 404 if hotel is not found', async () => {
    req = { params: { id: 'H999' } };
    hotels.findOne.mockResolvedValue(null); // Simulate no hotel found

    await getHotelById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Hotel not found" });
  });

  // Create New Hotel
  it('should add a new hotel successfully', async () => {
    req = { body: { name: 'Beachside Resort', location: 'Miami' } };
    
    // We mock the instance .save() method
    hotels.prototype.save = jest.fn().mockResolvedValue(req.body);

    await createNewHotel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'added new hotel successfull'
    }));
  });
});