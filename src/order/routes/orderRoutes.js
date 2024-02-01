const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, checkRole } = require('../../middleware/authMiddleware');

// Route POST để thêm đơn hàng mới
router.post('/', authMiddleware, orderController.createOrder);
// Route để lấy danh sách đơn hàng mới
router.get('/', checkRole(['admin']), orderController.getNewOrders);
// Route để lấy chi tiết đơn hàng dựa trên ID
router.get('/detail/:orderId', authMiddleware, orderController.getOrderById);

// Route để lấy danh sách đơn hàng của một người dùng
router.get('/user/:userId', checkRole(['admin']), orderController.getOrdersUserByAdmin);
router.get('/user', authMiddleware, orderController.getOrdersByUser);


// Route để cập nhật trạng thái xem của đơn hàng
router.put('/:id/viewed', orderController.markOrderAsViewed);
// Route để cập nhật trạng thái đơn hàng
router.put('/:orderId/status', checkRole(['admin']), orderController.updateOrderStatus);
// Route để cập nhật trạng thái thanh toán của đơn hàng
router.put('/:orderId/payment-status', checkRole(['admin']), orderController.updatePaymentStatus);

// Route để xóa đơn hàng
router.delete('/:orderId', checkRole(['admin']), orderController.deleteOrder);

module.exports = router;
