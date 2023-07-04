const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const userRolesEnum = require('../constants/userRolesEnum');
const ImageService = require('../services/imageService');

/**
 * Create user.
 */
exports.createUser = catchAsync(async (req, res) => {
  // const user = await userService.createUser(...)

  const newUser = await User.create({
    role: userRolesEnum.USER,
    ...req.body,
  });

  // const newUser = User(req.body);

  // await newUser.save();

  newUser.password = undefined;

  res.status(201).json({
    user: newUser,
  });
});

/**
 * Get users list.
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
 * Get user by id.
 */
exports.getUserById = (req, res) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
};

/**
 * Update user by id.
 */
exports.updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      year: req.body.year,
      email: req.body.email,
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
 * Delete user by id.
 */
exports.deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.sendStatus(204);
});

/**
 * Get logged in user info.
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

/**
 * Update logged in user data. Upload photo.
 */
exports.updateMe = catchAsync(async (req, res) => {
  const { user, file } = req;

  if (file) {
    user.avatar = await ImageService.save(file, null, 'images', 'users', user.id);
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
    // user.name = req.body.name;
    // user.year = req.body.year;
  });

  const updatedUser = await user.save();

  res.status(200).json({
    user: updatedUser,
  });
});

/**
 * Update logged in user password.
 */
exports.updateMyPassword = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};
