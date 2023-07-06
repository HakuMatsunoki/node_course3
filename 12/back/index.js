const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

dotenv.config({ path: './.env' });

const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB successfully connected..');
  })
  .catch((err) => {
    console.log(err);

    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(express.static('statics'));

// ENDPOINTS ========================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/', viewRoutes);

app.get('/api/v1/ping', (req, res) => {
  res.status(200).json({
    msg: 'pong!',
  });
});

// UNKNOWN REQUESTS HANDLER ==========
app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Oops! Resource not found..',
  });
});

// GLOBAL ERROR HANDLER ==============
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// SERVER =====================
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});

// SOCKET EXAMPLE ====================
const io = socketIO(server);

// EX. 1 basic example
// io.on('connection', (socket) => {
//   console.log('Socket user connected..');

//   socket.emit('message', { msg: 'Hello from socket!!' });

//   socket.on('custom event', (data) => {
//     console.log(data);
//   });
// });

// EX. 2 general chat
// io.on('connection', (socket) => {
//   socket.on('message', (msg) => {
//     console.log(`Message from client: ${msg}`);

//     io.emit('message', msg);
//   });
// });

// EX. 3 rooms implementation
const nodeNamespace = io.of('/nodeNamespace');

nodeNamespace.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    nodeNamespace.in(data.room).emit('message', `New user joined ${data.room} room`);
  });

  socket.on('message', (data) => {
    nodeNamespace.in(data.room).emit('message', data.msg);
  });
});

module.exports = server;
