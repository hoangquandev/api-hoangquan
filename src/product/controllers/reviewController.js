const Order = require("../../order/models/orderModel");
const Review = require("../models/reviewModel");

const reviewController = {
    addReview: async () => {
        const userId = req.id
        const { rating, content } = req.body;
        const { productId } = req.params;

        try {
            // Kiểm tra xem người dùng đã mua sản phẩm hay chưa
            const order = await Order.findOne({ userId: userId, 'products.productId': productId, paymentStatus: 'paid' });
            if (!order) {
                return res.status(400).json({ message: 'Bạn không có quyền thêm đánh giá cho sản phẩm này' });
            }

            // Tạo đánh giá mới
            const newReview = new Review({
                userId,
                productId,
                rating,
                content,
                approved: false
            });

            // Lưu đánh giá vào database
            await newReview.save();

            res.status(201).json({ message: 'Đánh giá đã được thêm thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    approveReview: async (req, res) => {
        try {
            const { reviewId } = req.params;

            // Tìm đánh giá trong cơ sở dữ liệu
            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
            }

            // Cập nhật trạng thái của đánh giá sang đã được duyệt
            review.approved = true;
            await review.save();

            res.status(200).json({ message: 'Đánh giá đã được duyệt thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    getUnapprovedReviews: async (req, res) => {
        try {
            const unapprovedReviews = await Review.find({ approved: false });
            res.status(200).json(unapprovedReviews);
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    updateReview: async (req, res) => {
        const { reviewId } = req.params;
        const { rating, content } = req.body;

        try {
            // Kiểm tra xem review có tồn tại không
            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Không tìm thấy review' });
            }

            // Kiểm tra quyền sở hữu của người dùng
            if (review.userId.toString() !== req.id) {
                return res.status(403).json({ message: 'Bạn không có quyền sửa review này' });
            }

            // Cập nhật review
            review.rating = rating;
            review.content = content;
            await review.save();

            res.status(200).json({ message: 'Review đã được cập nhật thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    getUserReviews: async (req, res) => {
        const userId = req.id;

        try {
            // Lấy danh sách review của người mua hàng
            const userReviews = await Review.find({ userId }).populate('productId');
            res.status(200).json(userReviews);
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    getReviewsByProduct: async () => {
        const { productId } = req.params;

        try {
            // Tìm tất cả đánh giá của sản phẩm
            const reviews = await Review.find({ productId });

            res.status(200).json({ reviews });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    getAverageRating: async () => {
        const { productId } = req.params;

        try {
            // Tính điểm trung bình của sản phẩm dựa trên đánh giá đã được duyệt
            const averageRating = await Review.aggregate([
                {
                    $match: {
                        productId: mongoose.Types.ObjectId(productId),
                        approved: true // Chỉ lấy các đánh giá đã được duyệt
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' }
                    }
                }
            ]);

            // Kiểm tra xem có đánh giá nào không
            if (averageRating.length === 0) {
                return res.status(404).json({ message: 'Sản phẩm không có đánh giá đã duyệt' });
            }

            // Trả về điểm trung bình
            res.status(200).json({ averageRating: averageRating[0].averageRating });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
}
module.exports = reviewController