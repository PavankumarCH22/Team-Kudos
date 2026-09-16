const express = require('express');
const { check } = require('express-validator');
const {
  createKudos,
  getKudosFeed,
  getKudosById,
  getReceivedKudos,
  getSentKudos,
  toggleReaction
} = require('../controllers/kudosController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    check('recipientId', 'Recipient ID is required').notEmpty(),
    check('points', 'Points must be 10, 20, or 50').isIn([10, 20, 50, '10', '20', '50']),
    check('message', 'Appreciation message must be at least 5 characters').isLength({ min: 5 }),
    check('tags', 'At least one value tag is required').isArray({ min: 1 })
  ],
  validate,
  createKudos
);

router.get('/', getKudosFeed);
router.get('/received', getReceivedKudos);
router.get('/sent', getSentKudos);
router.get('/:id', getKudosById);
router.post('/:id/reactions', toggleReaction);

module.exports = router;
