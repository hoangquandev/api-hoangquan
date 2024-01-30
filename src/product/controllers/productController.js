const { default: slugify } = require('slugify');
const Product = require('../models/productModel');

const productController = {
    createProduct: async (req, res) => {
        try {
            const { name, description, price, status, category } = req.body;

            // Tạo sản phẩm mới
            const newProduct = new Product({
                name,
                description,
                price,
                status,
                category
            });

            // Kiểm tra xem trường slug đã tồn tại hay chưa
            if (!newProduct.slug) {
                // Nếu slug chưa tồn tại, tạo slug dựa trên name
                newProduct.slug = slugify(newProduct.name, { lower: true });
            }

            // Lưu sản phẩm mới vào cơ sở dữ liệu
            const savedProduct = await newProduct.save();

            // Trả về phản hồi thành công với sản phẩm đã được tạo
            res.status(201).json({ message: 'Tạo sản phẩm mới thành công' });
        } catch (error) {
            // Xử lý lỗi nếu có
            if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
                // Nếu lỗi là trùng lặp khóa duy nhất của trường slug
                res.status(400).json({ message: 'Slug đã tồn tại, vui lòng chọn tên khác' });
            } else {
                // Xử lý các lỗi khác
                res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sản phẩm mới', error: error.message });
            }
        }
    },
    getProductsbyAdmin: async (req, res) => {
        try {
            // Lấy danh sách sản phẩm từ cơ sở dữ liệu
            const products = await Product.find().populate('category');

            // Trả về danh sách sản phẩm
            res.status(200).json(products);
        } catch (error) {
            // Xử lý lỗi nếu có
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm', error: error.message });
        }
    },
    getProductBySlug: async (req, res) => {
        try {
            const slug = req.params.slug;

            // Tìm sản phẩm theo slug và populate thông tin của category
            const product = await Product.findOne({ slug }).populate('category');

            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
            }

            // Trả về sản phẩm tìm thấy
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm theo slug.', error: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const { name, description, price, status, category } = req.body;

            // Tìm sản phẩm cần cập nhật
            const productToUpdate = await Product.findById(productId);

            if (!productToUpdate) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }

            // Kiểm tra xem tên sản phẩm đã thay đổi hay không
            if (name !== productToUpdate.name) {
                // Nếu tên sản phẩm đã thay đổi, tạo slug mới từ tên mới
                let slug = slugify(name, { lower: true });

                // Kiểm tra xem slug mới đã tồn tại trong cơ sở dữ liệu hay chưa
                const existingProductWithSameSlug = await Product.findOne({ slug });
                if (existingProductWithSameSlug && !existingProductWithSameSlug._id.equals(productId)) {
                    // Nếu slug đã tồn tại cho sản phẩm khác, báo lỗi và yêu cầu người dùng đổi tên khác
                    return res.status(400).json({ message: 'Slug đã tồn tại, vui lòng chọn tên khác' });
                }

                // Cập nhật slug mới vào sản phẩm
                productToUpdate.slug = slug;
            }

            // Cập nhật thông tin sản phẩm
            productToUpdate.name = name;
            productToUpdate.description = description;
            productToUpdate.price = price;
            productToUpdate.status = status;
            productToUpdate.category = category; // Cập nhật categoryId

            // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
            await productToUpdate.save();

            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công' });
        } catch (error) {
            // Xử lý lỗi nếu có
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm', error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            // Tìm và xóa sản phẩm dựa trên ID
            const deletedProduct = await Product.findByIdAndDelete(productId);

            // Kiểm tra xem sản phẩm có tồn tại không
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
            }

            // Trả về phản hồi thành công nếu sản phẩm được xóa thành công
            res.status(200).json({ message: 'Sản phẩm đã được xóa thành công.' });
        } catch (error) {
            // Xử lý lỗi nếu có
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm.', error: error.message });
        }
    },
    getPublicProducts: async (req, res) => {
        try {
            // Lấy danh sách sản phẩm public từ cơ sở dữ liệu
            const products = await Product.find({ status: true });

            res.status(200).json(products);
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    }
};

module.exports = productController;
