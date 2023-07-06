const { Router } = require('express');

const authController = require('../controllers/authController');
const authMiddlewares = require('../middlewares/authMiddlewares');

const router = Router();

router.post('/signup', authMiddlewares.checkSignupUserData, authController.signup);
router.post('/login', authController.login);
router.post('/restore-password', authController.forgotPassword); // restore password => send restore token by email
router.post('/set-new-password/:otp', authController.resetPassword); // set new password

module.exports = router;
