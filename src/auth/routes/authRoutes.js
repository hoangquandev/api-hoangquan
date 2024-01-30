const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, checkRole } = require('../../middleware/authMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh', authController.refreshToken);

router.post('/logout', authMiddleware, authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

//admin
router.post('/admin/register', checkRole(['admin']), authController.registerUserByAdmin);


module.exports = router;
