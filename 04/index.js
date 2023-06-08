const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const userRoutes = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// ENDPOINTS ========================
app.use('/users', userRoutes);

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

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
