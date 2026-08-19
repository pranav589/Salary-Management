import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import employeesRouter from './routes/employees';
import analyticsRouter from './routes/analytics';
import exchangeRatesRouter from './routes/exchangeRates';
import configsRouter from './routes/configs';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/employees', employeesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/exchange-rates', exchangeRatesRouter);
app.use('/api/configs', configsRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
