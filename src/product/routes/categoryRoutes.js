const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route để lấy tất cả các danh mục
router.get('/', categoryController.getAllCategories);

// Route để lấy chi tiết của một danh mục
router.get('/:id', categoryController.getCategoryById);

// Route để tạo mới một danh mục
router.post('/', categoryController.createCategory);

// Route để sửa thông tin của một danh mục
router.put('/:id', categoryController.updateCategory);

// Route để xóa một danh mục
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
