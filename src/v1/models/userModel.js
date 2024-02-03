const mongoose = require('mongoose');
const Db1 = require('../../config/db').Db1;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'buyer', 'client', 'student'], required: true, default: 'buyer' },
    phone: { type: String },
    avatar: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const UserModel = Db1.model('User', userSchema);

module.exports = UserModel;
