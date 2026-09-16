const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    avatar: {
      type: String,
      default: function () {
        // SVG DiceBear avatar fallback based on user email or random seed
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          this.email || this.name || 'default'
        )}`;
      }
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Engineering', 'Design', 'Marketing', 'Sales'],
        message: 'Department must be Engineering, Design, Marketing, or Sales'
      },
      index: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true
    },
    givingAllowance: {
      type: Number,
      default: 100,
      min: [0, 'Giving allowance cannot be negative']
    },
    earnedPoints: {
      type: Number,
      default: 0,
      min: [0, 'Earned points cannot be negative']
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null,
      select: false
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);
