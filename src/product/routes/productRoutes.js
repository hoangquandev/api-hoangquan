const express = require('express');
const router = express.Router();
const { checkRole, authMiddleware } = require('../../middleware/authMiddleware');
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');

router.post('/', checkRole(['admin']), productController.createProduct);
router.get('/', checkRole(['admin', 'dev']), productController.getProductsbyAdmin);
router.get('/public', productController.getPublicProducts);
router.get('/:slug', productController.getProductBySlug);
router.put('/:id', checkRole(['admin']), productController.updateProduct);
router.delete('/:id', checkRole(['admin']), productController.deleteProduct);

// Endpoint cho review sản phẩm
router.post('/reviews/:productId', authMiddleware, reviewController.addReview);
router.put('/reviews/:reviewId', authMiddleware, reviewController.updateReview);
router.get('/reviews/user', authMiddleware, reviewController.getUserReviews);
router.get('/reviews/unapproved', checkRole(['admin']), reviewController.getUnapprovedReviews);
router.put('/:reviewId/approve', checkRole(['admin']), reviewController.approveReview);
router.get('/:productId/reviews', reviewController.getReviewsByProduct);
router.get('/:productId/average-rating', reviewController.getAverageRating);


module.exports = router;
