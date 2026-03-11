const { verifyToken } = require('../middleware/authMiddleware');
const { updateProfile, deleteUser } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedTokenSchema');
const User = require('../models/userModel');
 
describe('Security Layer Tests', () => {
  let req, res, next;
 
  // Reset mocks before every single test
  beforeEach(() => {
    jest.clearAllMocks();
    req = { cookies: {}, params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });
 
// --- 1. AUTHENTICATION ---
it('should allow access when a valid token is in cookies', async () => {
 
  req.cookies.token = 'mock_valid_token';
 
  //Mock jwt.verify to return a valid payload synchronously
  jest.spyOn(jwt, 'verify').mockReturnValue({
    userId: '123',
    role: 'user',
    jti: 'some_unique_id'
  });
 
  // Mock the database check
  RevokedToken.findOne = jest.fn().mockResolvedValue(null);
 
  //  Run the middleware
  await verifyToken(req, res, next);
 
  //  Verify results
  expect(next).toHaveBeenCalled();
  expect(req.user.userId).toBe('123');
});
 
 
  // 2.LOGOUT SECURITY
  it('should block access if the token has been revoked (logged out)', async () => {
    req.cookies.token = 'blacklisted_token';
   
    jest.spyOn(jwt, 'verify').mockReturnValue({ jti: 'token_id_123' });
    // Simulate finding the token ID in the "Revoked" database
    RevokedToken.findOne = jest.fn().mockResolvedValue({ jti: 'token_id_123' });
 
    await verifyToken(req, res, next);
   
    // Should return 401 Unauthorized
    expect(res.status).toHaveBeenCalledWith(401);
  });
 
  // 3.DATA PRIVACY
  it('should prevent a user from editing a different user profile', async () => {
    req.params.id = 'user_99';          // Target profile ID
    req.user = { userId: 'user_1' };    // Logged in user ID (mismatch!)
 
    await updateProfile(req, res, next);
   
    // Should return 403 Forbidden
    expect(res.status).toHaveBeenCalledWith(403);
  });
 
  // 4.ACCIDENTAL DELETION
  it('should block an admin from deleting their own account', async () => {
    req.params.id = 'admin_id';
    req.user = { userId: 'admin_id' }; // IDs match
   
    // Mock finding the user in the database
    User.findById = jest.fn().mockResolvedValue({
      _id: { toString: () => 'admin_id' }
    });
 
    await deleteUser(req, res, next);
   
    // Should return 400 Bad Request
    expect(res.status).toHaveBeenCalledWith(400);
  });
});