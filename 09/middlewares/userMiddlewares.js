const { Types } = require('mongoose');
const uuid = require('uuid').v4;
const multer = require('multer');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createUserDataValidator, updateUserDataValidator } = require('../utils/userValidators');
const ImageService = require('../services/imageService');

/**
 * Check user exists in db by id middleware.
 */
exports.checkUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new AppError(400, 'Bad request..');

  const user = await User.findById(id);

  if (!user) throw new AppError(404, 'User does not exist..');

  // USING SERVICES PATTERN
  // req.user = await userService.checkId(id)

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

/**
 * Update User data validation middleware
 */
exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = updateUserDataValidator(req.body);

  if (error) return next(new AppError(400, 'Invalid user data..'));

  // const userExists = await User.exists({ email: value.email });
  const userExists = await User.findOne({ email: value.email });

  const userIsTheSame = req.user.id === userExists.id;

  if (userExists && !userIsTheSame) return next(new AppError(400, 'User with this email already exists..'));

  req.body = value;

  next();
});

// Multer explanation
/*
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, 'statics/img/users');
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split('/')[1]; // jpeg, png, gif, jpg...

    cbk(null, `${req.user.id}-${uuid()}.${extension}`); // 4987qr3498w7ct83247ct8-f7q388x7fq7xyf-fr43qy.jpg
  },
});

const multerFilter = (req, file, cbk) => {
  // 'image/jpg'

  if (file.mimetype.startsWith('image/')) {
    cbk(null, true);
  } else {
    cbk(new AppError(400, 'Please, upload images only!'), false);
  }
};

exports.uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single('avatar');
*/

exports.uploadUserAvatar = ImageService.upload('avatar');

exports.checkPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // :TODO add newPassword validation

  const user = await User.findById(req.user.id).select('password');

  if (!(await user.checkPassword(currentPassword, user.password))) {
    throw new AppError(401, 'Current password wrong..');
  }

  user.password = newPassword;

  await user.save();

  next();
});
