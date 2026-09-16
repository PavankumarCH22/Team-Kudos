const mongoose = require('mongoose');
const Kudos = require('../models/Kudos');

// Helper to calculate start & end of month date range
const getMonthDateRange = (yearParam, monthParam) => {
  const now = new Date();
  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) - 1 : now.getMonth(); // 0-indexed month

  const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  return { startDate, endDate, year, month: month + 1 };
};

// @desc    Get monthly leaderboard with aggregation pipeline
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
  try {
    const { year, month, department } = req.query;
    const { startDate, endDate, year: selectedYear, month: selectedMonth } = getMonthDateRange(year, month);

    const matchStage = {
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$recipient',
          totalPoints: { $sum: '$points' },
          kudosCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' }
    ];

    if (department) {
      pipeline.push({
        $match: {
          'employee.department': department
        }
      });
    }

    pipeline.push(
      {
        $project: {
          _id: 0,
          userId: '$employee._id',
          name: '$employee.name',
          email: '$employee.email',
          avatar: '$employee.avatar',
          department: '$employee.department',
          totalPoints: 1,
          kudosCount: 1
        }
      },
      {
        $sort: { totalPoints: -1, kudosCount: -1 }
      },
      { $limit: 50 }
    );

    const rankings = await Kudos.aggregate(pipeline);

    // Assign rank positions
    const leaderboard = rankings.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    res.status(200).json({
      success: true,
      period: {
        year: selectedYear,
        month: selectedMonth,
        startDate,
        endDate
      },
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get department statistics & points distribution
// @route   GET /api/leaderboard/departments
// @access  Private
const getDepartmentStats = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const { startDate, endDate } = getMonthDateRange(year, month);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
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
          totalPoints: { $sum: '$points' },
          totalKudos: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          totalPoints: 1,
          totalKudos: 1
        }
      },
      { $sort: { totalPoints: -1 } }
    ];

    const stats = await Kudos.aggregate(pipeline);

    const allDepartments = ['Engineering', 'Design', 'Marketing', 'Sales'];
    const departmentMap = {};
    stats.forEach((s) => {
      departmentMap[s.department] = s;
    });

    const fullStats = allDepartments.map((dept) => ({
      department: dept,
      totalPoints: departmentMap[dept]?.totalPoints || 0,
      totalKudos: departmentMap[dept]?.totalKudos || 0
    }));

    res.status(200).json({
      success: true,
      departmentStats: fullStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
  getDepartmentStats
};
