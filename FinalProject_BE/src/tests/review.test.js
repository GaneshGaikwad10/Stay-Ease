

const reviewController = require('../controllers/reviewController');
const Hotel = require('../models/hotelModel');
const User = require('../models/userModel');

// Mock Hotel and User models
jest.mock('../models/hotelModel');
jest.mock('../models/userModel');

describe('Review Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // TEST 1: Get reviews for a hotel
  it('should return reviews and rating if hotel exists', async () => {
    req.params.id = 'hotel123';

    Hotel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        reviews: [{ userId: 'u1', reviewText: 'Nice', rating: 4 }],
        rating: 4
      })
    });

    await reviewController.getReviewsByHotel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      reviews: [{ userId: 'u1', reviewText: 'Nice', rating: 4 }],
      rating: 4
    });
  });

  it('should return 404 if hotel not found', async () => {
    req.params.id = 'hotel404';

    Hotel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await reviewController.getReviewsByHotel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Hotel not found' });
  });

  // TEST 2: Add a new review
  it('should add a review and award points', async () => {
    req.body = {
      userId: 'u1',
      userName: 'Amit',
      hotelId: 'hotel123',
      reviewText: 'Great stay!',
      rating: 5
    };

    const hotelMock = {
      reviews: [],
      rating: 0,
      save: jest.fn().mockResolvedValue(true)
    };
    Hotel.findOne.mockResolvedValue(hotelMock);

    const userMock = { points: 100, save: jest.fn().mockResolvedValue(true) };
    User.findById.mockResolvedValue(userMock);

    await reviewController.addReview(req, res, next);

    expect(hotelMock.reviews.length).toBe(1);
    expect(userMock.points).toBe(150);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Review added successfully',
        pointsEarned: 50,
        totalPoints: 150
      })
    );
  });

  it('should block duplicate reviews', async () => {
    req.body = {
      userId: 'u1',
      userName: 'Amit',
      hotelId: 'hotel123',
      reviewText: 'Second review',
      rating: 3
    };

    const hotelMock = {
      reviews: [{ userId: 'u1', reviewText: 'First review', rating: 5 }],
      save: jest.fn()
    };
    Hotel.findOne.mockResolvedValue(hotelMock);

    await reviewController.addReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'You have already submitted a review for this hotel.'
    });
  });

  it('should return 404 if user not found when awarding points', async () => {
    req.body = {
      userId: 'u404',
      userName: 'Amit',
      hotelId: 'hotel123',
      reviewText: 'Nice place',
      rating: 4
    };

    const hotelMock = {
      reviews: [],
      rating: 0,
      save: jest.fn().mockResolvedValue(true)
    };
    Hotel.findOne.mockResolvedValue(hotelMock);

    User.findById.mockResolvedValue(null);

    await reviewController.addReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});
