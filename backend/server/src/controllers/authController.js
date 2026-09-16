const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies
} = require('../utils/token');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate simulation email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      passwordHash,
      department,
      verificationToken,
      emailVerified: false
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        emailVerified: user.emailVerified
      },
      devSimulation: {
        verificationToken,
        verificationLink: `http://localhost:5173/verify-email?token=${verificationToken}&email=${encodeURIComponent(
          email
        )}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get tokens in httpOnly cookies
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshTokenStr = generateRefreshToken(user);

    // Save refresh token record for token rotation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      user: user._id,
      token: refreshTokenStr,
      expiresAt,
      ipAddress: req.ip
    });

    setAuthCookies(res, accessToken, refreshTokenStr);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: user.toJSON(),
      accessToken // also return in response for API consumers/testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token with rotation
// @route   POST /api/auth/refresh
// @access  Public (uses httpOnly refresh token cookie)
const refreshToken = async (req, res, next) => {
  try {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    const decoded = verifyRefreshToken(incomingToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const savedToken = await RefreshToken.findOne({ token: incomingToken });
    if (!savedToken || savedToken.isRevoked) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked or is invalid'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Refresh token rotation: Revoke existing token and issue a new one
    const newRefreshTokenStr = generateRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    savedToken.isRevoked = true;
    savedToken.replacedByToken = newRefreshTokenStr;
    await savedToken.save();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      user: user._id,
      token: newRefreshTokenStr,
      expiresAt,
      ipAddress: req.ip
    });

    setAuthCookies(res, newAccessToken, newRefreshTokenStr);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & revoke refresh token
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (incomingToken) {
      await RefreshToken.updateOne({ token: incomingToken }, { isRevoked: true });
    }

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email (development simulation)
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    let user;
    if (token) {
      user = await User.findOne({ verificationToken: token }).select('+verificationToken');
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification request or token'
      });
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password (development simulation)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset link generated (development simulation)',
      devSimulation: {
        resetToken,
        resetLink: `http://localhost:5173/reset-password?token=${resetToken}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password (development simulation)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You may now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
};
