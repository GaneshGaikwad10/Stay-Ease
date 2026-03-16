const mongoose = require('mongoose');


const revokedTokenSchema = new mongoose.Schema({
    jti: { type: String, required: true, unique: true },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 3720 
    }
});
module.exports = mongoose.model('RevokedToken', revokedTokenSchema);