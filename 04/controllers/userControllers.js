const uuid = require('uuid').v4;
const fs = require('fs').promises;

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createUserDataValidator } = require('../utils/userValidators');

/**
 * Create user
 */
exports.createUser = catchAsync(async (req, res, next) => {
  const { error, value } = createUserDataValidator(req.body);

  if (error) return next(new AppError(400, 'Bad User data..'));

  const usersDB = await fs.readFile('./models.json');

  const users = JSON.parse(usersDB);

  const newUser = {
    ...value,
    id: uuid(),
  };

  users.push(newUser);

  await fs.writeFile('./models.json', JSON.stringify(users));

  res.status(201).json({
    user: newUser,
  });
});

/**
 * Get users list
 */
exports.getUsersList = catchAsync(async (req, res) => {
  const users = JSON.parse(await fs.readFile('./model.json'));

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
exports.updateUserById = (req, res) => {};

/**
 * Delete user by id
 */
exports.deleteUserById = (req, res) => {};
