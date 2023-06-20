const { Router } = require('express');

const authController = require('../controllers/authController');
const authMiddlewares = require('../middlewares/authMiddlewares');

const router = Router();

router.post('/signup', authMiddlewares.checkSignupUserData, authController.signup);
router.post('/login', authController.login);

module.exports = router;
