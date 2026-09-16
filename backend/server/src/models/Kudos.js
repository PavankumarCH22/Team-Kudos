const mongoose = require('mongoose');

const kudosSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
      enum: {
        values: [10, 20, 50],
        message: 'Points must be 10, 20, or 50'
      }
    },
    message: {
      type: String,
      required: [true, 'Appreciation message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters long'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    tags: {
      type: [String],
      required: [true, 'At least one company value tag is required'],
      validate: {
        validator: function (val) {
          const validTags = ['#Teamwork', '#CustomerObsession', '#Innovation'];
          return Array.isArray(val) && val.length > 0 && val.every((t) => validTags.includes(t));
        },
        message: 'Tags must be from #Teamwork, #CustomerObsession, #Innovation'
      }
    },
    reactionsCount: {
      plusOne: { type: Number, default: 0 },
      clap: { type: Number, default: 0 },
      fire: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Index for feed pagination and monthly leaderboard date filtering
kudosSchema.index({ createdAt: -1 });
kudosSchema.index({ createdAt: -1, recipient: 1 });

module.exports = mongoose.model('Kudos', kudosSchema);
