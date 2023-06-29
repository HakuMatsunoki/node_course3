const userRolesEnum = require('../constants/userRolesEnum');
const Todo = require('../models/todoModel');
const catchAsync = require('../utils/catchAsync');

exports.createTodo = catchAsync(async (req, res) => {
  const newTodoData = {
    owner: req.user,
    title: req.body.title,
    description: req.body.description,
    due: req.body.due,
  };

  const newTodo = await Todo.create(newTodoData);

  res.status(201).json({
    todo: newTodo,
  });
});

exports.getTodosList = catchAsync(async (req, res) => {
  const { limit, page, sort, order, search } = req.query;

  // SEARCH FEATURE ==================================

  // search by title OR by description
  // const findOptions = {
  //   $or: [
  //     {
  //       title: {
  //         $regex: 'Fir',
  //         $options: 'i',
  //       },
  //       owner: req.user
  //     },
  //     {
  //       description: {
  //         $regex: 'Fir',
  //         $options: 'i',
  //       },
  //       owner: req.user
  //     },
  //   ],
  // };

  const findOptions = search
    ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] }
    : {};

  if (search && req.user.role === userRolesEnum.USER) {
    findOptions.$or.forEach((item) => {
      item.owner = req.user;
    });
  }

  if (!search && req.user.role === userRolesEnum.USER) {
    findOptions.owner = req.user;
  }

  // init database query
  const todosQuery = Todo.find(findOptions);

  // todosQuery.select('-title');

  // SORTING FEATURE ==================================
  // order = 'ASC' || 'DESC'
  // .sort('title') || .sort('-description')
  todosQuery.sort(`${order === 'DESC' ? '-' : ''}${sort || 'title'}`);

  // PAGINATION FEATURE ====================================
  // 100
  // limit = 10 elements
  // skip = 30 elements
  // page1 = skip 0
  // page2 = skip 10
  // page3 = skip 20

  const paginationPage = +page || 1; // '1' => 1
  const paginationLimit = +limit || 5;
  const skip = (paginationPage - 1) * paginationLimit;

  todosQuery.skip(skip).limit(paginationLimit);

  const todos = await todosQuery;
  const total = await Todo.count(findOptions);

  res.status(200).json({
    todos,
    total,
  });
});
