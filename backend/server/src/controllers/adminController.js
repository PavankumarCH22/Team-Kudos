const User = require('../models/User');
const Kudos = require('../models/Kudos');
const ResetLog = require('../models/ResetLog');

// @desc    Get admin dashboard overall stats & department analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalEmployees = await User.countDocuments();
    const totalKudosSent = await Kudos.countDocuments();

    const pointsAgg = await Kudos.aggregate([
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$points' }
        }
      }
    ]);
    const totalPointsDistributed = pointsAgg[0]?.totalPoints || 0;

    const departmentEmployeeCounts = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentKudosStats = await Kudos.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'recipient',
          foreignField: '_id',
          as: 'recipientUser'
        }
      },
      { $unwind: '$recipientUser' },
      {
        $group: {
          _id: '$recipientUser.department',
          pointsReceived: { $sum: '$points' },
          kudosCount: { $sum: 1 }
        }
      }
    ]);

    const recentResets = await ResetLog.find().sort({ executedAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        totalKudosSent,
        totalPointsDistributed,
        departmentEmployeeCounts,
        departmentKudosStats,
        recentResets
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employees for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAdminUsers = async (req, res, next) => {
  try {
    const { search, department, role } = req.query;
    const query = {};

    if (department) query.department = department;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details by admin (e.g. role, department, givingAllowance, earnedPoints)
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin only)
const updateAdminUser = async (req, res, next) => {
  try {
    const { role, department, givingAllowance, earnedPoints, emailVerified } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (department && ['Engineering', 'Design', 'Marketing', 'Sales'].includes(department)) user.department = department;
    if (givingAllowance !== undefined && givingAllowance >= 0) user.givingAllowance = Number(givingAllowance);
    if (earnedPoints !== undefined && earnedPoints >= 0) user.earnedPoints = Number(earnedPoints);
    if (emailVerified !== undefined) user.emailVerified = Boolean(emailVerified);

    await user.save();

    res.status(200).json({
      success: true,
      message: `Employee ${user.name} updated successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUser
};
