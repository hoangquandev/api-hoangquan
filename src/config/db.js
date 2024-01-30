const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        // Kết nối đến MongoDB từ biến môi trường
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối đến MongoDB thành công');
    } catch (error) {
        console.error('Kết nối đến MongoDB thất bại:', error.message);
        process.exit(1); // Thoát ứng dụng nếu kết nối không thành công
    }
};

module.exports = connectToDatabase;