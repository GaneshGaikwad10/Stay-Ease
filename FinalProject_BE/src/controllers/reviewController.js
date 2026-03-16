const Hotel = require('../models/hotelModel');
const User = require('../models/userModel');

// Get reviews for a hotel
exports.getReviewsByHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.params.id }).select('reviews rating');
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ reviews: hotel.reviews, rating: hotel.rating });
  } catch (err) {
    next(err);
  }
};

// Add a new review
exports.addReview = async (req, res, next) => {
  try {
    const { userId, userName, hotelId, reviewText, rating } = req.body;

    // Find hotel
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Prevent duplicate review
    const existing = hotel.reviews.find(r => r.userId.toString() === userId.toString());
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a review for this hotel." });
    }

    // Add review to hotel
    hotel.reviews.push({ userId, userName, reviewText, rating });

    // Update hotel rating (average of all reviews)
    hotel.rating = hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length;
    await hotel.save();

    // Award loyalty points directly to user
    // const user = await User.findById(userId);
    // if (!user) return res.status(404).json({ message: "User not found" });

    // user.points += 50;
    // await user.save();

    res.status(201).json({
      message: "Review added successfully",
      review: { userId, userName, reviewText, rating },
      updatedHotelRating: hotel.rating,
      pointsEarned: 50,
    });
  } catch (err) {
    next(err);
  }
};
