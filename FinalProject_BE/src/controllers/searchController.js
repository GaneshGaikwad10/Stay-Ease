
const Hotel = require('../models/hotelModel');

exports.searchHotel = async (req, res, next) => {
    try {
        const { destination, checkIn, checkOut, adults, children } = req.body;

        const cleanStart = checkIn.split('_')[0]; 
        const cleanEnd = checkOut.split('_')[0];

        // Generate the range of regex patterns
        const rangeRegex = getDatesRegexRange(cleanStart, cleanEnd);

        const hotels = await Hotel.find({
            location: { $regex: destination, $options: 'i' },
            rooms: {
                $elemMatch: {
                    status: "Available",
                    capacityAdults: { $gte: Number(adults) },
                    capacityChildren: { $gte: Number(children) },
                    unavailableDates: {
                        $not: { $in: rangeRegex }
                    }
                }
            }
        });

        res.json(hotels);
    } catch (err) {
        next(err);
    }
}

function getDatesRegexRange(startDate, endDate) {
    const patterns = [];
    let current = new Date(startDate);
    const stop = new Date(endDate);

    while (current <= stop) {
        const dateString = current.toISOString().split('T')[0];
        
        patterns.push(new RegExp(`^${dateString}`)); 
        
        current.setDate(current.getDate() + 1);
    }
    return patterns;
}