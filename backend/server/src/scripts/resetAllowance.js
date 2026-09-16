require('dotenv').config({ path: __dirname + '/../../.env' });
const connectDB = require('../config/db');
const { performMonthlyReset } = require('../services/allowanceService');

const runReset = async () => {
  try {
    await connectDB();
    console.log('Running manual monthly allowance reset script...');
    
    // Pass force/period if supplied via CLI argument e.g. node resetAllowance.js 2026-10
    const customPeriod = process.argv[2] || null;
    const result = await performMonthlyReset(customPeriod);
    
    console.log('Result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error during allowance reset script:', error);
    process.exit(1);
  }
};

runReset();
