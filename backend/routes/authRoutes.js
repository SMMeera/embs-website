const router = require('express').Router();
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',        register);
router.post('/login',           login);
router.post('/logout',          logout);
router.get('/me',               protect, getMe);
router.patch('/update-me',      protect, updateMe);
router.patch('/update-password', protect, updatePassword);

module.exports = router;
