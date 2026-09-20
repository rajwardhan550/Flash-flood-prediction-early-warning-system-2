const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGODB_URI: Joi.string().required().description('Authoritative MongoDB connection URI'),
  REDIS_URL: Joi.string().uri({ scheme: ['redis', 'rediss'] }).default('redis://127.0.0.1:6379'),
  JWT_SECRET: Joi.string().min(16).required().description('HMAC SHA256 secret for authentication'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  CLIENT_URL: Joi.string().uri().default('http://localhost:5173'),
  ML_SERVICE_URL: Joi.string().uri().default('http://127.0.0.1:8000'),
  OPENWEATHER_API_KEY: Joi.string().allow('').optional()
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`[CONFIG ERROR] Critical environment variable validation failure: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongo: {
    uri: envVars.MONGODB_URI,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  clientUrl: envVars.CLIENT_URL,
  mlServiceUrl: envVars.ML_SERVICE_URL,
  openWeatherApiKey: envVars.OPENWEATHER_API_KEY,
};