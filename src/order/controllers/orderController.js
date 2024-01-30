const Order = require('../models/orderModel');

const orderController = {
    createOrder: async (req, res) => {
        try {
            // Lấy thông tin về đơn hàng từ request body
            const { user, address, phoneNumber, products, status, orderDate, deliveryDate, paymentMethod, paymentStatus, totalAmount } = req.body;

            // Tạo một đối tượng Order mới từ thông tin nhận được
            const newOrder = new Order({
                user,
                address,
                phoneNumber,
                products,
                status,
                orderDate,
                deliveryDate,
                paymentMethod,
                paymentStatus,
                totalAmount
            });

            // Lưu đơn hàng mới vào cơ sở dữ liệu
            const savedOrder = await newOrder.save();

            // Trả về phản hồi với thông tin về đơn hàng đã được tạo thành công
            res.status(201).json({ message: 'Đơn hàng đã được tạo thành công' });
        } catch (error) {
            // Xử lý lỗi nếu có
            res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm đơn hàng mới', error: error.message });
        }
    },
    // Hàm lấy danh sách đơn hàng mới
    getNewOrders: async (req, res) => {
        try {
            const newOrders = await Order.find().sort({ orderDate: -1 });
            res.status(200).json(newOrders);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng mới', error: error.message });
        }
    },

    // Hàm cập nhật trạng thái xem của đơn hàng
    markOrderAsViewed: async (req, res) => {
        try {
            const orderId = req.params.id;
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { isViewed: true }, { new: true });
            res.status(200).json({ message: 'Đã cập nhật trạng thái xem của đơn hàng' });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái xem của đơn hàng', error: error.message });
        }
    }
};

module.exports = orderController;
