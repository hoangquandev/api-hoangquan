const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkRole, authMiddleware } = require('../../middleware/authMiddleware');
const checkExistingEmail = require('../../middleware/checkExistingEmail');


router.put('/me', authMiddleware, checkExistingEmail, userController.updateCurrentUser);
router.get('/profile', authMiddleware, userController.viewCurrentUserProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

//admin
router.get('/', checkRole(['admin', 'dev']), userController.getAllUsers);
router.put('/:userId', checkRole(['admin', 'dev']), userController.updateUser);
router.get('/:userId', checkRole(['admin', 'dev']), userController.viewUserProfileByAdmin);
router.delete('/:userId', checkRole(['admin', 'dev']), userController.deleteUser);

module.exports = router;
