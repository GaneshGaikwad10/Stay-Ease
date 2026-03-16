const chai = require('chai');
const sinon = require('sinon');
const { verifyToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedTokenSchema');
const expect = chai.expect;
 
describe('Security Layer Tests', () => {
  let req, res, next;
 
  beforeEach(() => {
    req = { cookies: {}, params: {}, body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });
 
  afterEach(() => {
    sinon.restore();
  });
 
  it('should allow access when a valid token is in cookies', async () => {
    req.cookies.token = 'mock_valid_token';
 
    const verifyStub = sinon.stub(jwt, 'verify').returns({
      userId: '123',
      role: 'user',
      jti: 'some_unique_id'
    });
 
    const findOneStub = sinon.stub(RevokedToken, 'findOne').resolves(null);
 
    await verifyToken(req, res, next);
 
    expect(next.calledOnce).to.be.true;
    expect(req.user.userId).to.equal('123');
  });
 
  it('should block access if the token has been revoked (logged out)', async () => {
    req.cookies.token = 'blacklisted_token';
 
    const verifyStub = sinon.stub(jwt, 'verify').returns({ jti: 'token_id_123' });
 
    const findOneStub = sinon.stub(RevokedToken, 'findOne').resolves({ jti: 'token_id_123' });
 
    await verifyToken(req, res, next);
 
    expect(res.status.calledWith(401)).to.be.true;
  });
});