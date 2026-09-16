const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
  {
    kudos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kudos',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    emoji: {
      type: String,
      required: true,
      enum: ['+1', '👏', '🔥']
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user can react with a specific emoji to a kudos post only once
reactionSchema.index({ kudos: 1, user: 1, emoji: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
