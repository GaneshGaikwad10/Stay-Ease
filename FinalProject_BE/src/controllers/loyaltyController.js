const User = require('../models/userModel');

// Get loyalty points
exports.getPoints = async (req, res, next) => {
  try {
    const loyalty = await User.findById(req.params.id).select('points');
    if (!loyalty) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ points: loyalty.points });
  } catch (err) {
    next(err);
  }
};

// Update loyalty points (redeem/add)
exports.updatePoints = async (req, res, next) => {
  try {
    const { amount, action } = req.body;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'add') {
      user.points += amount;
    } else if (action === 'redeem') {
      if (amount > user.points) return res.status(400).json({ message: "Not enough points" });
      user.points -= amount;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.status(200).json({ message: "Points updated", points: user.points });
  } catch (err) {
    next(err);
  }
};


