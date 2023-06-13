const { Types } = require('mongoose');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createUserDataValidator } = require('../utils/userValidators');

/**
 * Check user exists in db by id middleware.
 */
exports.checkUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) return next(new AppError(400, 'Bad request..'));

  const user = await User.findById(id);

  if (!user) return next(new AppError(404, 'User does not exist..'));

  req.user = user;

  next();
});

/**
 * Create User data validation middleware
 */
exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = createUserDataValidator(req.body);

  if (error) return next(new AppError(400, 'Invalid user data..'));

  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(400, 'User with this email already exists..'));

  req.body = value;

  next();
});
