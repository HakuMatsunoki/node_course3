const Todo = require('../models/todoModel');
const catchAsync = require('../utils/catchAsync');

exports.home = (req, res) => {
  res.status(200).render('home', {
    title: 'Todos Home',
    active: 'home',
  });
};

exports.todos = catchAsync(async (req, res) => {
  const todos = await Todo.find().populate('owner');

  console.log('||=============>>>>>>>>>>>');
  console.log(todos);
  console.log('<<<<<<<<<<<=============||');

  res.status(200).render('todos', {
    title: 'Todos List',
    active: 'todos',
    todos,
  });
});
