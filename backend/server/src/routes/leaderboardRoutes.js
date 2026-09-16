const express = require('express');
const { getLeaderboard, getDepartmentStats } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getLeaderboard);
router.get('/departments', getDepartmentStats);

module.exports = router;
