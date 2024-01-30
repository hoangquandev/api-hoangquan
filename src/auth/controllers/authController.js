const status = require('../../config/httpStatusCodes');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { sendEmail } = require('../../utils/emailService');

const authController = {
    // Controller xử lý đăng ký
    register: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            // Kiểm tra xem username hoặc email đã tồn tại trong cơ sở dữ liệu chưa
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Tên người dùng hoặc email đã tồn tại' });
            }

            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo một người dùng mới
            const newUser = new User({
                username,
                password: hashedPassword,
                email
            });

            // Lưu người dùng mới vào cơ sở dữ liệu
            await newUser.save();


            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },
    // Controller xử lý đăng ký admin
    registerUserByAdmin: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            // Kiểm tra xem username hoặc email đã tồn tại trong cơ sở dữ liệu chưa
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Tên người dùng hoặc email đã tồn tại' });
            }

            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo một người dùng mới với quyền được chỉ định
            const newUser = new User({
                username,
                password: hashedPassword,
                email,
                role: role || 'customer' // Nếu không có quyền được chỉ định, mặc định là 'customer'
            });

            // Lưu người dùng mới vào cơ sở dữ liệu
            await newUser.save();

            // Trả về thông tin người dùng đã đăng ký thành công
            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },
    // Controller xử lý đăng nhập và trả về Access Token và Refresh Token
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu bằng email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email không tồn tại' });
            }

            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác' });
            }

            // Tạo Access Token với vai trò của người dùng
            const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

            // Tạo Refresh Token
            const refreshToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // Cập nhật refreshToken trong cơ sở dữ liệu
            user.refreshToken = refreshToken;
            await user.save();

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.body.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Không tìm thấy RefreshToken' });
            }

            let decodedToken;
            try {
                decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'RefreshToken đã hết hạn' });
                } else {
                    throw error;
                }
            }

            const userId = decodedToken.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(403).json({ message: 'Người dùng không tồn tại' });
            }

            // Kiểm tra refreshToken có khớp với refreshToken trong cơ sở dữ liệu không
            if (refreshToken !== user.refreshToken) {
                return res.status(403).json({ message: 'RefreshToken không hợp lệ' });
            }


            // Tạo một AccessToken mới
            const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

            // Trả về AccessToken mới
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },

    // Controller để gửi email đặt lại mật khẩu
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu bằng email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email không tồn tại' });
            }

            // Tạo token để đặt lại mật khẩu
            const resetToken = jwt.sign({ email: user.email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h' });

            // Cập nhật token vào cơ sở dữ liệu và cập nhật thời gian hết hạn của token
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // Token hết hạn sau 1 giờ
            await user.save();

            // Gửi email chứa liên kết đặt lại mật khẩu đến người dùng
            const resetLink = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;
            const emailSubject = 'Reset Password';
            const emailText = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

            await sendEmail(user.email, emailSubject, emailText);

            res.status(200).json({ message: 'Email đặt lại mật khẩu đã được gửi thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { resetToken, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu bằng token đặt lại mật khẩu
            const user = await User.findOne({ resetPasswordToken: resetToken });

            // Kiểm tra xem token có hợp lệ và chưa hết hạn không
            if (!user || user.resetPasswordExpires < Date.now()) {
                return res.status(400).json({ message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
            }

            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cập nhật mật khẩu mới và xóa token đặt lại mật khẩu
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            const userId = req.id;

            // Xóa refreshToken của người dùng từ cơ sở dữ liệu
            await User.findByIdAndUpdate(userId, { refreshToken: null });

            res.status(200).json({ message: 'Đã đăng xuất thành công' });
        } catch (error) {
            console.error('Đã xảy ra lỗi khi logout:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi logout' });
        }
    }
};

module.exports = authController;