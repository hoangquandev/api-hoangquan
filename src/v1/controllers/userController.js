// controllers/userController.js
const UserModel = require('../models/userModel');

const userController = {
    registerBuyer: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Tạo người dùng mới với vai trò buyer
            const newUser = new UserModel({
                username,
                email,
                password,
                role: 'buyer'
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await newUser.save();

            res.status(201).json({ message: 'Đăng kí thành công.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    registerCustomRole: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            // Kiểm tra quyền của người dùng
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền.' });
            }

            // Tạo người dùng mới với vai trò được chỉ định
            const newUser = new UserModel({
                username,
                email,
                password,
                role
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await newUser.save();

            res.status(201).json({ message: `Người dùng đã được tạo thành công với vai trò ${role}.` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await UserModel.findOne({ email });

            // Kiểm tra xem người dùng tồn tại và mật khẩu khớp
            if (!user || password !== user.password) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
            }

            // Tạo mã thông báo JWT
            const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
