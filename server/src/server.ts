import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';

// Initialize express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HealthAI API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;
