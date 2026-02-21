const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Basic env validation
const requiredEnv = ['MONGODB_URI'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`Error: Environment variable ${env} is missing`);
    process.exit(1);
  }
});

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/raw-materials', require('./routes/rawMaterials'));
app.use('/api/processes', require('./routes/processes'));
app.use('/api/wip', require('./routes/wip'));
app.use('/api/finished-products', require('./routes/finishedProducts'));
app.use('/api/quality-checks', require('./routes/quality'));
app.use('/api/analytics', require('./routes/analytics'));

// Serve index.html for all other routes (Single Page App support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
