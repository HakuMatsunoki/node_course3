const fs = require('fs').promises;

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Check user exists in db by id middleware.
 */
// exports.checkUserById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (id.length < 10) {
//       return res.status(400).json({
//         message: 'Bad request..',
//       });
//     }

//     const users = JSON.parse(await fs.readFile('./models.json'));

//     const user = users.find((item) => item.id === id);

//     if (!user) {
//       return res.status(404).json({
//         message: 'User does not exist..',
//       });
//     }

//     req.user = user;

//     next();
//   } catch (err) {
//     console.log(err);

//     res.sendStatus(500);
//   }
// };
exports.checkUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id.length < 10) return next(new AppError(400, 'Bad request..'));

  const users = JSON.parse(await fs.readFile('./models.json'));

  const user = users.find((item) => item.id === id);

  if (!user) return next(new AppError(404, 'User does not exist..'));

  req.user = user;

  next();
});
