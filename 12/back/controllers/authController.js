const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userRolesEnum = require('../constants/userRolesEnum');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userNameHandler = require('../utils/userNameHandler');
const Email = require('../services/emailService');

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
  const { name, ...restUserData } = req.body;

  const newUserData = {
    ...restUserData,
    role: userRolesEnum.USER,
    name: userNameHandler(name),
  };

  const newUser = await User.create(newUserData);

  try {
    await new Email(newUser, 'localhost:3000').sendHello();
  } catch (err) {
    console.log(err);
  }

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

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction sent to email..',
    });
  }

  // one time password
  const otp = user.createPasswordResetToken();

  await user.save();

  // send otp via email // http://dew.dsa.com/cdsfcds
  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/set-new-password/${otp}`;

    console.log('||=============>>>>>>>>>>>');
    console.log(resetUrl);
    console.log('<<<<<<<<<<<=============||');

    await new Email(user, resetUrl).sendRestorePassword();

    // const emailTransopt = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
    // const emailTransopt = nodemailer.createTransport({
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 2525,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // const emailConfig = {
    //   from: 'Todos app admin <admin@example.com>',
    //   to: user.email,
    //   subject: 'Password reset instruction',
    //   text: resetUrl,
    // };

    // await emailTransopt.sendMail(emailConfig);

    // send email
  } catch (err) {
    console.log(err);

    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  res.status(200).json({
    msg: 'Password reset instruction sent to email..',
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError(400, 'Token is invalid..');

  user.password = req.body.password; // make sure to write validation
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    user,
  });
});
