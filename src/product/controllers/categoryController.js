const Category = require("../models/categoryModel");


const categoryController = {
    // Lấy tất cả các danh mục
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách các danh mục:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách các danh mục' });
        }
    },

    // Lấy chi tiết một danh mục dựa trên ID
    getCategoryById: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' });
            }
            res.status(200).json(category);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết một danh mục:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết một danh mục' });
        }
    },

    // Tạo mới một danh mục
    createCategory: async (req, res) => {
        try {
            const { name, description, slug } = req.body;
            const category = new Category({ name, description, slug });
            await category.save();
            res.status(201).json({ message: 'Danh mục đã được tạo thành công' });
        } catch (error) {
            console.error('Lỗi khi tạo mới một danh mục:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo mới một danh mục' });
        }
    },

    // Xóa một danh mục
    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            await Category.findByIdAndDelete(categoryId);
            res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa một danh mục:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa một danh mục' });
        }
    },

    // Sửa thông tin của một danh mục
    updateCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const { name, description, slug } = req.body;
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name, description, slug }, { new: true });
            res.status(200).json({ message: 'Danh mục đã được cập nhật thành công' });
        } catch (error) {
            console.error('Lỗi khi cập nhật một danh mục:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật một danh mục' });
        }
    }
}

module.exports = categoryController;
