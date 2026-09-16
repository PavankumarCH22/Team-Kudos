const User = require('../models/User');
const Kudos = require('../models/Kudos');

// Helper to derive badges based on kudos received
const calculateBadges = (earnedPoints, kudosReceivedCount) => {
  const badges = [];
  if (earnedPoints >= 50) badges.push({ id: 'bronze', name: 'Bronze Appreciator', icon: '🥉', desc: 'Earned 50+ points' });
  if (earnedPoints >= 150) badges.push({ id: 'silver', name: 'Silver Star', icon: '🥈', desc: 'Earned 150+ points' });
  if (earnedPoints >= 300) badges.push({ id: 'gold', name: 'Gold Champion', icon: '🥇', desc: 'Earned 300+ points' });
  if (kudosReceivedCount >= 5) badges.push({ id: 'team_player', name: 'Team Favorite', icon: '🌟', desc: 'Received 5+ kudos' });
  if (kudosReceivedCount >= 15) badges.push({ id: 'kudos_legend', name: 'Kudos Legend', icon: '👑', desc: 'Received 15+ kudos' });
  return badges;
};

// @desc    Get logged in user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const kudosReceivedCount = await Kudos.countDocuments({ recipient: user._id });
    const kudosSentCount = await Kudos.countDocuments({ sender: user._id });

    const badges = calculateBadges(user.earnedPoints, kudosReceivedCount);

    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        stats: {
          kudosReceivedCount,
          kudosSentCount,
          badges
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees with autocomplete / filtering
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const { search, department, excludeSelf } = req.query;
    const query = {};

    if (excludeSelf === 'true') {
      query._id = { $ne: req.user._id };
    }

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('name email avatar department role earnedPoints givingAllowance').sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const kudosReceived = await Kudos.find({ recipient: user._id })
      .populate('sender', 'name avatar department')
      .sort({ createdAt: -1 })
      .limit(20);

    const kudosSent = await Kudos.find({ sender: user._id })
      .populate('recipient', 'name avatar department')
      .sort({ createdAt: -1 })
      .limit(20);

    const kudosReceivedCount = kudosReceived.length;
    const kudosSentCount = kudosSent.length;
    const badges = calculateBadges(user.earnedPoints, kudosReceivedCount);

    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        stats: {
          kudosReceivedCount,
          kudosSentCount,
          badges
        },
        kudosReceived,
        kudosSent
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PATCH /api/users/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, department, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (department) user.department = department;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  getUsers,
  getUserById,
  updateMe
};
