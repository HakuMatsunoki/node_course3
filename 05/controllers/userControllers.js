const uuid = require('uuid').v4;
const fs = require('fs').promises;

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createUserDataValidator } = require('../utils/userValidators');
const User = require('../models/userModel');
const userRolesEnum = require('../constants/userRolesEnum');

/**
 * Create user
 */
exports.createUser = catchAsync(async (req, res) => {
  // const user = await userService.createUser(...)
  const newUser = await User.create({
    role: userRolesEnum.USER,
    ...req.body,
  });

  newUser.password = undefined;

  res.status(201).json({
    user: newUser,
  });
});

/**
 * Get users list
 */
exports.getUsersList = catchAsync(async (req, res) => {
  // const users = await User.find().select('-__v +password');
  // const users = await User.find().select('-__v -role');
  const users = await User.find().select('-__v');

  res.status(200).json({
    users,
  });
});

/**
 * Get user by id
 */
exports.getUserById = (req, res) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
};

/**
 * Update user by id
 */
exports.updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      year: req.body.year,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    user: updatedUser,
  });
});

/**
 * Delete user by id
 */
exports.deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.sendStatus(204);
});
