const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer', 'student', 'dev'], default: 'customer' },
    phone: { type: String },
    address: { type: String },
    email: { type: String, unique: true },
    refreshToken: { type: String, unique: true },
    resetPasswordToken: { type: String, maxlength: 512 },
    resetPasswordExpires: { type: Date },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
