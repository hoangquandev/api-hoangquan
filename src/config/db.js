const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        // Kết nối đến MongoDB từ URI mặc định
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối đến MongoDB mặc định thành công');

        // Kết nối đến MongoDB từ URI mới từ biến môi trường
        const Db1 = mongoose.createConnection(process.env.DB1_MONGODB_URI);
        Db1.on('error', err => {
            console.error('Kết nối đến MongoDB mới thất bại:', err.message);
            process.exit(1); // Thoát ứng dụng nếu kết nối không thành công
        });
        Db1.once('open', () => console.log('Kết nối đến DB1 thành công'));
    } catch (error) {
        console.error('Kết nối đến MongoDB mặc định thất bại:', error.message);
        process.exit(1); // Thoát ứng dụng nếu kết nối không thành công
    }
};

module.exports = connectToDatabase;
