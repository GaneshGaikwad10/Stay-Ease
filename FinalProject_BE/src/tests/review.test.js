const chai = require('chai');
const sinon = require('sinon');
const reviewController = require('../controllers/reviewController');
const Hotel = require('../models/hotelModel');
const expect = chai.expect;
 
describe('Review Controller', () => {
  let req, res, next;
 
  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });
 
  afterEach(() => {
    sinon.restore();
  });
 
  it('should return reviews and rating if hotel exists', async () => {
    req.params.id = 'hotel123';
 
    const findOneStub = sinon.stub(Hotel, 'findOne').returns({
      select: sinon.stub().resolves({
        reviews: [{ userId: 'u1', reviewText: 'Nice', rating: 4 }],
        rating: 4
      })
    });
 
    await reviewController.getReviewsByHotel(req, res, next);
 
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({
      reviews: [{ userId: 'u1', reviewText: 'Nice', rating: 4 }],
      rating: 4
    })).to.be.true;
  });
 
  it('should return 404 if hotel not found', async () => {
    req.params.id = 'hotel404';
 
    const findOneStub = sinon.stub(Hotel, 'findOne').returns({
      select: sinon.stub().resolves(null)
    });
 
    await reviewController.getReviewsByHotel(req, res, next);
 
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Hotel not found' })).to.be.true;
  });
});
 