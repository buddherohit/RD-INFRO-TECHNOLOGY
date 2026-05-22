const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorHandler');
const { seedStudents } = require('./controllers/studentController');

const app = express();

// Standard express parsing & security middlewares
app.use(cors());
app.use(express.json());

// Base Server Verification Endpoint
app.get('/', (req, res) => {
  res.status(200).send('Lumina Academy REST API Server running successfully.');
});

// Register student API routes
app.use('/api/students', studentRoutes);

// Centralized error handling middleware
app.use(errorHandler);

// Database connection & server boot parameters
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumina-academy';
const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB database...');
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    // Automatically seed data if collection is empty
    await seedStudents();
    
    // Start Express listener once DB is ready
    app.listen(PORT, () => {
      console.log(`Lumina Academy Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('CRITICAL: MongoDB Connection Failed!');
    console.error(err.message);
    console.log('Ensure MongoDB service is active on your machine or configure MONGO_URI in .env.');
    
    // Graceful startup even if DB is offline (allows developer fallback/logging)
    app.listen(PORT, () => {
      console.log(`Lumina Academy Server started in OFFLINE Mode on http://localhost:${PORT}`);
      console.log('Warning: Database-driven API endpoints will return errors until database is connected.');
    });
  });
