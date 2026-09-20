const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { port, clientUrl } = require('./config/env');
const { connectDB } = require('./config/database');
const cache = require('./config/redis');
const logger = require('./utils/logger');
const socketHandler = require('./websocket/socketHandler');

// Routes
const authRoutes = require('./routes/auth');
const iotRoutes = require('./routes/iot');
const riskRoutes = require('./routes/risk');
const alertRoutes = require('./routes/alerts');
const authorityRoutes = require('./routes/authority');
const monitoringRoutes = require('./routes/monitoring');
const weatherRoutes = require('./routes/weather');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// CORS Config
const corsOptions = {
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim(), { subsystem: 'API' }) } }));

// Initialize WebSocket Bus
socketHandler.init(server, corsOptions);

// REST API Registry
app.use('/api/auth', authRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
// Health Endpoint
app.get('/api/health', (req, res) => {
  const isRedisOnline = typeof cache.status === 'function' 
    ? cache.status() 
    : (typeof cache.isHealthy === 'function' ? cache.isHealthy() : false);

  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'connected',
      redis: isRedisOnline ? 'online' : 'degraded'
    }
  });
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { subsystem: 'API', stack: err.stack });
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Server Initialization
const startServer = async () => {
  await connectDB();

  server.listen(port, () => {
    logger.info(`FloodAtlas Core Backend active on port ${port}`, { subsystem: 'BOOT' });
    logger.info(`WebSocket gateway active and ready for client subscriptions.`, { subsystem: 'BOOT' });
  });
};

startServer();

module.exports = { app, server };