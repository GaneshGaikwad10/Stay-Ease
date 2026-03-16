const chai = require('chai');
const sinon = require('sinon');
const { createBooking, updateBookingStatus } = require('../controllers/bookingController');
const Booking = require('../models/bookingModel');
const expect = chai.expect;
 
describe('Booking Controller Tests', () => {
  let req, res, next;
 
  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });
 
  afterEach(() => {
    sinon.restore();
  });
 
  it('should create a booking successfully', async () => {
    req = { body: { userId: '123', hotelId: 'abc', status: 'Pending' } };
 
    const saveStub = sinon.stub(Booking.prototype, 'save').resolves(req.body);
 
    await createBooking(req, res, next);
 
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(sinon.match({ message: 'Booking created Successfully' }))).to.be.true;
  });
 
  it('should return 400 for an invalid status update', async () => {
    req = {
      params: { bookingId: 'b1' },
      body: { status: 'InvalidStatusName' }
    };
 
    await updateBookingStatus(req, res, next);
 
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: "Update failed, Enter valid status..." })).to.be.true;
  });
});