
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedTokenSchema');
const asyncHandler = require('./asyncHandler');


const verifyToken = asyncHandler(async (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isRevoked = await RevokedToken.findOne({ jti: decoded.jti });
    
    if (isRevoked) {
      return res.status(401).json({ success: false, message: "Token revoked. Please login again." });
    }

    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role?.toLowerCase();

      if (!req.user || !allowedRoles.includes(userRole)) {
          return res.status(403).json({ 
              success: false,
              message: `Role (${req.user?.role}) is not authorized for this resource` 
          });
      }
      next();
    };
};
module.exports = { verifyToken, authorizeRoles };