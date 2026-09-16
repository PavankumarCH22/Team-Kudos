const express = require('express');
const { getMe, getUsers, getUserById, updateMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
