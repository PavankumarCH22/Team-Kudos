const cron = require('node-cron');
const { performMonthlyReset } = require('../services/allowanceService');

const initMonthlyResetJob = () => {
  // Schedule task to run at 00:00 on the 1st day of every month
  cron.schedule('0 0 1 * *', async () => {
    console.log('[CRON] Starting automated monthly allowance reset...');
    try {
      const result = await performMonthlyReset();
      console.log(`[CRON] ${result.message}`);
    } catch (error) {
      console.error('[CRON] Failed monthly allowance reset:', error);
    }
  });

  console.log('Monthly allowance reset cron job scheduled (0 0 1 * *).');
};

module.exports = { initMonthlyResetJob };
