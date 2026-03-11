const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: true, 
        select: false // Ensures password isnt leaked in random queries
    },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'hotel manager'], 
        default: 'user' 
    },
    phone: { type: Number },
    isActive: { type: Boolean, default: true },
    location: { type: String },
    points: {type: Number, default:500}
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);