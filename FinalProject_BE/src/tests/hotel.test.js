const chai = require('chai');
const sinon = require('sinon');
const { getAllHotels, getHotelById } = require('../controllers/hotelController');
const hotels = require('../models/hotelModel');
const expect = chai.expect;
 
describe('Hotel Controller - Get and Add Tests', () => {
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
 
  it('should get all hotels successfully', async () => {
    const mockHotels = [{ name: 'Grand Stay', location: 'New York' }];
    const findStub = sinon.stub(hotels, 'find').resolves(mockHotels);
 
    await getAllHotels(req, res, next);
 
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ data: mockHotels })).to.be.true;
  });
 
  it('should return 404 if hotel is not found', async () => {
    req = { params: { id: 'H999' } };
    const findOneStub = sinon.stub(hotels, 'findOne').resolves(null);
 
    await getHotelById(req, res, next);
 
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Hotel not found" })).to.be.true;
  });
});