const express = require('express');
const { getAdminDashboard, getAdminUsers, updateAdminUser } = require('../controllers/adminController');
const { performMonthlyReset } = require('../services/allowanceService');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAdminUsers);
router.patch('/users/:id', updateAdminUser);

router.post('/reset-allowance', async (req, res, next) => {
  try {
    const result = await performMonthlyReset(req.body.period);
    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
