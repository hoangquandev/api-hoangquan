// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('..//controllers/userController');

// Route để đăng ký người dùng mặc định là buyer
router.post('/register', userController.registerBuyer);

// Route để tạo người dùng mới với vai trò tùy chỉnh (chỉ admin có quyền)
router.post('/admin/register', userController.registerCustomRole);

// Route để đăng nhập cho web admin dashboard (admin, client, student)
router.post('/login', userController.login);

// Route để đăng nhập cho web của khách hàng mua
router.post('/buyer/login', userController.login);

module.exports = router;
