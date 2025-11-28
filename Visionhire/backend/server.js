import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/db.js';
import authRoutesCjs from './routes/auth.routes.js';
import interviewRoutesCjs from './routes/interview.routes.js';
import authMiddleware from './middleware/authMiddleware.js';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutesCjs);

// ✅ Public route for ping (no auth needed)
app.get('/api/interview/ping', (req, res) => {
  res.status(200).json({ message: 'Interview API is live 🚀' });
});

// ✅ Protected interview routes
app.use('/api/interview', authMiddleware, interviewRoutesCjs);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
