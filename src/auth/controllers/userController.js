const User = require('../models/userModel');
const bcrypt = require('bcrypt')

// Controller: Lấy danh sách tất cả người dùng
const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, 'username email role phone status address orders').populate('orders');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng', error: error.message });
        }
    },
    updateUser: async (req, res) => {
        const { userId } = req.params;
        const { username, email, role, phone, status, address } = req.body;

        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }
            if (email !== user.email) {
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
                }
            }

            // Cập nhật thông tin người dùng
            user.username = username;
            user.email = email;
            user.role = role;
            user.phone = phone;
            user.status = status;
            user.address = address;

            await user.save();

            res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    updateCurrentUser: async (req, res) => {
        const userId = req.id; // Lấy ID của người dùng từ token xác thực
        const { username, email, phone, address } = req.body;

        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Cập nhật thông tin người dùng
            user.username = username;
            user.email = email;
            user.phone = phone;
            user.address = address;

            await user.save();

            res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công', user });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    viewUserProfileByAdmin: async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Trả về thông tin hồ sơ của người dùng
            res.status(200).json({ user });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    viewCurrentUserProfile: async (req, res) => {
        const userId = req.id; // Lấy ID của người dùng từ token xác thực

        try {
            const user = await User.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Trả về thông tin hồ sơ của người dùng
            res.status(200).json(user);
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    changePassword: async (req, res) => {
        const userId = req.id; // Lấy ID của người dùng từ token xác thực
        const { currentPassword, newPassword } = req.body;

        try {
            const user = await User.findById(userId);

            // Kiểm tra xem mật khẩu hiện tại có khớp không
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
            }

            // Hash mật khẩu mới trước khi lưu vào cơ sở dữ liệu
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    deleteUser: async (req, res) => {
        const userId = req.params.userId;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Xóa người dùng từ cơ sở dữ liệu
            await User.findByIdAndDelete(userId);

            res.status(200).json({ message: 'Người dùng đã được xóa thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    }
}

module.exports = userController
