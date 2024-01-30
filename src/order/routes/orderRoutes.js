const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route POST để thêm đơn hàng mới
router.post('/', orderController.createOrder);
// Route để lấy danh sách đơn hàng mới
router.get('/', orderController.getNewOrders);

// Route để cập nhật trạng thái xem của đơn hàng
router.put('/:id/viewed', orderController.markOrderAsViewed);

module.exports = router;
