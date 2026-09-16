const mongoose = require('mongoose');
const Kudos = require('../models/Kudos');
const User = require('../models/User');
const Reaction = require('../models/Reaction');

// Helper to map emoji string to schema key
const getEmojiKey = (emoji) => {
  if (emoji === '+1') return 'plusOne';
  if (emoji === '👏') return 'clap';
  if (emoji === '🔥') return 'fire';
  return null;
};

// @desc    Give Kudos (Atomic point transfer & transaction recording)
// @route   POST /api/kudos
// @access  Private
const createKudos = async (req, res, next) => {
  const { recipientId, points, message, tags } = req.body;
  const senderId = req.user._id.toString();

  // 1. Prevent sending kudos to oneself
  if (senderId === recipientId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot send kudos to yourself'
    });
  }

  // 2. Validate points parameter
  const validPoints = [10, 20, 50];
  if (!validPoints.includes(Number(points))) {
    return res.status(400).json({
      success: false,
      message: 'Points must be 10, 20, or 50'
    });
  }

  // 3. Verify recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({
      success: false,
      message: 'Recipient employee not found'
    });
  }

  // 4. Atomic transaction with standalone fallback
  let kudosDoc;
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const sender = await User.findById(senderId).session(session);
    if (!sender || sender.givingAllowance < points) {
      throw new Error('INSUFFICIENT_ALLOWANCE');
    }

    sender.givingAllowance -= points;
    await sender.save({ session });

    await User.findByIdAndUpdate(
      recipientId,
      { $inc: { earnedPoints: points } },
      { session }
    );

    const [created] = await Kudos.create(
      [
        {
          sender: senderId,
          recipient: recipientId,
          points,
          message,
          tags
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    kudosDoc = created;
  } catch (transError) {
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (e) {
        // ignore session abort errors
      }
    }

    if (transError.message === 'INSUFFICIENT_ALLOWANCE') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient giving allowance balance'
      });
    }

    // Fallback for standalone MongoDB deployments where transactions/replica set is not active
    try {
      const updatedSender = await User.findOneAndUpdate(
        { _id: senderId, givingAllowance: { $gte: points } },
        { $inc: { givingAllowance: -points } },
        { new: true }
      );

      if (!updatedSender) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient giving allowance balance'
        });
      }

      await User.findByIdAndUpdate(recipientId, { $inc: { earnedPoints: points } });

      kudosDoc = await Kudos.create({
        sender: senderId,
        recipient: recipientId,
        points,
        message,
        tags
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process kudos transaction',
        error: fallbackErr.message
      });
    }
  }

  // Populate sender & recipient for UI display
  const populatedKudos = await Kudos.findById(kudosDoc._id)
    .populate('sender', 'name email avatar department')
    .populate('recipient', 'name email avatar department');

  const updatedSender = await User.findById(senderId);

  res.status(201).json({
    success: true,
    message: `Successfully sent ${points} kudos points to ${recipient.name}!`,
    kudos: populatedKudos,
    updatedAllowance: updatedSender.givingAllowance
  });
};

// @desc    Get social kudos feed (Paginated with infinite scroll support & filters)
// @route   GET /api/kudos
// @access  Private
const getKudosFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { department, tag, search } = req.query;
    const query = {};

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.message = { $regex: search, $options: 'i' };
    }

    let kudosList = await Kudos.find(query)
      .populate('sender', 'name email avatar department')
      .populate('recipient', 'name email avatar department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter by department if requested (either sender or recipient department matches)
    if (department) {
      kudosList = kudosList.filter(
        (k) =>
          k.sender?.department === department ||
          k.recipient?.department === department
      );
    }

    // Attach current user's reaction status to each kudos
    const kudosIds = kudosList.map((k) => k._id);
    const userReactions = await Reaction.find({
      kudos: { $in: kudosIds },
      user: req.user._id
    });

    const userReactionsMap = {};
    userReactions.forEach((r) => {
      if (!userReactionsMap[r.kudos.toString()]) {
        userReactionsMap[r.kudos.toString()] = [];
      }
      userReactionsMap[r.kudos.toString()].push(r.emoji);
    });

    const enrichedFeed = kudosList.map((k) => {
      const doc = k.toObject();
      doc.userReactions = userReactionsMap[k._id.toString()] || [];
      return doc;
    });

    const totalDocs = await Kudos.countDocuments(query);
    const hasMore = skip + kudosList.length < totalDocs;

    res.status(200).json({
      success: true,
      count: enrichedFeed.length,
      total: totalDocs,
      page,
      pages: Math.ceil(totalDocs / limit),
      hasMore,
      kudos: enrichedFeed
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get kudos by ID
// @route   GET /api/kudos/:id
// @access  Private
const getKudosById = async (req, res, next) => {
  try {
    const kudos = await Kudos.findById(req.params.id)
      .populate('sender', 'name email avatar department')
      .populate('recipient', 'name email avatar department');

    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos post not found'
      });
    }

    const userReactions = await Reaction.find({
      kudos: kudos._id,
      user: req.user._id
    });

    const result = kudos.toObject();
    result.userReactions = userReactions.map((r) => r.emoji);

    res.status(200).json({
      success: true,
      kudos: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get kudos received by current user
// @route   GET /api/kudos/received
// @access  Private
const getReceivedKudos = async (req, res, next) => {
  try {
    const kudos = await Kudos.find({ recipient: req.user._id })
      .populate('sender', 'name email avatar department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: kudos.length,
      kudos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get kudos sent by current user
// @route   GET /api/kudos/sent
// @access  Private
const getSentKudos = async (req, res, next) => {
  try {
    const kudos = await Kudos.find({ sender: req.user._id })
      .populate('recipient', 'name email avatar department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: kudos.length,
      kudos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle emoji reaction on kudos post (+1, 👏, 🔥)
// @route   POST /api/kudos/:id/reactions
// @access  Private
const toggleReaction = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const kudosId = req.params.id;
    const userId = req.user._id;

    const emojiKey = getEmojiKey(emoji);
    if (!emojiKey) {
      return res.status(400).json({
        success: false,
        message: 'Invalid emoji. Options are +1, 👏, 🔥'
      });
    }

    const kudos = await Kudos.findById(kudosId);
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos post not found'
      });
    }

    const existingReaction = await Reaction.findOne({
      kudos: kudosId,
      user: userId,
      emoji
    });

    let reacted = false;

    if (existingReaction) {
      // Toggle off -> remove reaction
      await Reaction.deleteOne({ _id: existingReaction._id });
      if (kudos.reactionsCount[emojiKey] > 0) {
        kudos.reactionsCount[emojiKey] -= 1;
      }
    } else {
      // Toggle on -> add reaction
      await Reaction.create({ kudos: kudosId, user: userId, emoji });
      kudos.reactionsCount[emojiKey] += 1;
      reacted = true;
    }

    await kudos.save();

    const activeUserReactions = await Reaction.find({ kudos: kudosId, user: userId });
    const userEmojiList = activeUserReactions.map((r) => r.emoji);

    res.status(200).json({
      success: true,
      reacted,
      reactionsCount: kudos.reactionsCount,
      userReactions: userEmojiList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKudos,
  getKudosFeed,
  getKudosById,
  getReceivedKudos,
  getSentKudos,
  toggleReaction
};
