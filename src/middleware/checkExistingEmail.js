// middleware/checkExistingEmail.js

const User = require("../auth/models/userModel");



const checkExistingEmail = async (req, res, next) => {
    const { email } = req.body;
    const userId = req.id;

    try {
        const user = await User.findById(userId)
        if (email !== user.email) {

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
            }
        }

        next();
    } catch (error) {
        console.error('Lỗi kiểm tra email:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
};

module.exports = checkExistingEmail;
