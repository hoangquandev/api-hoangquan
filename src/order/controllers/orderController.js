const Order = require('../models/orderModel');

const orderController = {
    createOrder: async (req, res) => {
        try {
            const { user, address, phoneNumber, products, status, orderDate, deliveryDate, paymentMethod, paymentStatus } = req.body;

            // Tính tổng số tiền dựa trên giá và số lượng của từng sản phẩm
            const totalAmount = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);

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
            res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', order: savedOrder });
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
    },
    // Controller để lấy chi tiết đơn hàng dựa trên ID
    getOrderById: async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const order = await Order.findById(orderId).populate('user products.productId');
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng', error: error.message });
        }
    },
    getOrdersUserByAdmin: async (req, res) => {
        try {
            const userId = req.params.userId;
            const orders = await Order.find({ user: userId }).populate('products.productId');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng của người dùng', error: error.message });
        }
    },
    getOrdersByUser: async (req, res) => {
        try {
            const userId = req.id;
            const orders = await Order.find({ user: userId }).populate('products.productId');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng của người dùng', error: error.message });
        }
    }
};

module.exports = orderController;
