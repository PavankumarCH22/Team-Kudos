const User = require('../models/User');
const ResetLog = require('../models/ResetLog');

const performMonthlyReset = async (manualPeriod = null) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const period = manualPeriod || `${year}-${month}`;

  // Check if reset was already executed for this period
  const existingLog = await ResetLog.findOne({ period });
  if (existingLog && existingLog.status === 'SUCCESS') {
    return {
      alreadyExecuted: true,
      message: `Monthly allowance reset for period ${period} was already executed on ${existingLog.executedAt.toISOString()}`,
      usersResetCount: existingLog.usersResetCount
    };
  }

  try {
    // Set givingAllowance back to 100 for all users without affecting earnedPoints
    const result = await User.updateMany(
      {},
      { $set: { givingAllowance: 100 } }
    );

    const log = await ResetLog.findOneAndUpdate(
      { period },
      {
        period,
        usersResetCount: result.modifiedCount || result.nModified || 0,
        executedAt: new Date(),
        status: 'SUCCESS',
        details: `Successfully refreshed giving allowance to 100 points for ${result.modifiedCount} employees`
      },
      { upsert: true, new: true }
    );

    return {
      alreadyExecuted: false,
      message: `Monthly allowance reset complete for period ${period}`,
      usersResetCount: log.usersResetCount
    };
  } catch (error) {
    await ResetLog.findOneAndUpdate(
      { period },
      {
        period,
        usersResetCount: 0,
        executedAt: new Date(),
        status: 'FAILED',
        details: error.message
      },
      { upsert: true }
    );
    throw error;
  }
};

module.exports = { performMonthlyReset };
