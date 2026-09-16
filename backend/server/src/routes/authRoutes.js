const express = require('express');
const { check } = require('express-validator');
const {
  signup,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('department', 'Department is required').isIn(['Engineering', 'Design', 'Marketing', 'Sales'])
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validate,
  login
);

router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);

router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email address').isEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    check('token', 'Token is required').notEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  resetPassword
);

module.exports = router;
