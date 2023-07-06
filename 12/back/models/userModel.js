const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userRolesEnum = require('../constants/userRolesEnum');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'Duplicated email..'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    year: {
      type: Number,
    },
    role: {
      type: String,
      enum: Object.values(userRolesEnum), // ['user', 'admin', 'moderator']
      default: userRolesEnum.USER,
    },
    avatar: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre save hook. Fires on Create and Save.
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=retro`;
  }

  if (!this.isModified('password')) return next();

  // hash passwd only when passwd changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // const passwordIsValid = await bcrypt.compare('Pass&1234', hashedPassword);

  next();
});

// Custom methods
userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); // generate string of random symbols

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
