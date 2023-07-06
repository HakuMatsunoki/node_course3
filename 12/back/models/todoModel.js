const { Schema, Types, model } = require('mongoose');

const todoSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    description: {
      type: String,
      maxLength: 300,
    },
    due: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Todo must have an owner..'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Todo = model('Todo', todoSchema);

module.exports = Todo;
