const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
    try {
        // Kiểm tra xem có tồn tại AccessToken trong header Authorization không
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Không tìm thấy AccessToken' });
        }

        // Giải mã AccessToken để lấy userId
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userId = decodedToken.id;


        req.id = userId;

        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        res.status(401).json({ message: 'Lỗi xác thực AccessToken' });
    }
};
exports.checkRole = (roles) => {
    return (req, res, next) => {
        try {
            // Kiểm tra xem có tồn tại AccessToken trong header Authorization không
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Không tìm thấy AccessToken' });
            }

            // Tách token từ header Authorization
            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return res.status(401).json({ message: 'Không tìm thấy AccessToken' });
            }

            // Giải mã AccessToken để lấy thông tin người dùng, bao gồm vai trò (role)
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            const userRole = decodedToken.role;

            // Kiểm tra xem vai trò của người dùng có nằm trong mảng roles không
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }

            next();
        } catch (error) {
            console.error('Lỗi xác thực:', error);
            res.status(401).json({ message: 'Lỗi xác thực AccessToken' });
        }
    };
};


