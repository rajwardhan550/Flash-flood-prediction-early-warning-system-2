const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['citizen', 'authority', 'admin'],
      required: [true, 'User role is mandatory (citizen, authority, admin)'],
      index: true,
    },
    assignedZoneId: {
      type: String,
      ref: 'Zone',
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      sparse: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi'],
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Modern Mongoose async pre-save hook (no next callback needed)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);