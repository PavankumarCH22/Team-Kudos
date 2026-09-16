const mongoose = require('mongoose');

const resetLogSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
      unique: true,
      index: true // e.g. "2026-09"
    },
    usersResetCount: {
      type: Number,
      default: 0
    },
    executedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    },
    details: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ResetLog', resetLogSchema);
