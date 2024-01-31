const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, checkRole } = require('../../middleware/authMiddleware');

// Route POST để thêm đơn hàng mới
router.post('/', orderController.createOrder);
// Route để lấy danh sách đơn hàng mới
router.get('/', orderController.getNewOrders);
// Route để lấy chi tiết đơn hàng dựa trên ID
router.get('/:orderId', orderController.getOrderById);

// Route để lấy danh sách đơn hàng của một người dùng
router.get('/user/:userId', checkRole(['admin']), orderController.getOrdersUserByAdmin);
router.get('/user', authMiddleware, orderController.getOrdersByUser);


// Route để cập nhật trạng thái xem của đơn hàng
router.put('/:id/viewed', orderController.markOrderAsViewed);

module.exports = router;
