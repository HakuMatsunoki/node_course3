const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre save hook. Fires on Create and Save.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // hash passwd only when passwd changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // const passwordIsValid = await bcrypt.compare('Pass&1234', hashedPassword);

  next();
});

// Custom method
userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = mongoose.model('User', userSchema);

module.exports = User;
