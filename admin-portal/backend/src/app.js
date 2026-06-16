// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:5005"
        ]
      }
    }
  })
);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Route imports (all under src/routes)
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const dashboardRouter = require('./routes/dashboardRoutes');
const customerRouter = require('./routes/customerRoutes');
const orderRouter = require('./routes/orderRoutes');
const reportRouter = require('./routes/reportRoutes');

app.use('/api/auth', authRouter);
app.use('/api', apiRouter); // generic api router (if needed)
app.use('/api/dashboard', dashboardRouter);
app.use('/api/customers', customerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reports', reportRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Vrindhavanam Admin API is running' });
});

module.exports = app;
