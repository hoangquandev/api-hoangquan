const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectToDatabase = require('./config/db');
const authRoutes = require('./auth/routes/authRoutes');
const productRoutes = require('./product/routes/productRoutes')
const categoryRoutes = require('./product/routes/categoryRoutes')
const orderRoutes = require('./order/routes/orderRoutes')
const userRoutes = require('./auth/routes/userRoutes')


dotenv.config(); // Load các biến môi trường từ file .env

const app = express();

// Kết nối đến cơ sở dữ liệu MongoDB
connectToDatabase();

// Middleware để phân tích nội dung của yêu cầu dưới dạng JSON
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Các route và middleware khác ở đây
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);

module.exports = app;