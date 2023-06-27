const jwt = require('jsonwebtoken');

const userRolesEnum = require('../constants/userRolesEnum');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * JWT sign service function. Sign token with User ID in payload.
 * @param {string} id - user ID
 * @returns {string} - JWT
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Signup user.
 */
exports.signup = catchAsync(async (req, res) => {
  const newUserData = {
    ...req.body,
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  res.status(201).json({
    user: newUser,
    token,
  });
});

/**
 * Login user.
 */
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError(401, 'Not authorized!');

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) throw new AppError(401, 'Not authorized!');

  user.password = undefined;

  const token = signToken(user.id);

  res.status(200).json({
    user,
    token,
  });
});
