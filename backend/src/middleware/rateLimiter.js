const rateLimit = require('express-rate-limit');

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.'
  }
});

// Ingestion rate limiter for high-frequency IoT sensors
const ingestionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 telemetry packets per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Telemetry ingestion threshold exceeded.'
  }
});

// General public read API limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.'
  }
});

module.exports = {
  authLimiter,
  ingestionLimiter,
  apiLimiter
};