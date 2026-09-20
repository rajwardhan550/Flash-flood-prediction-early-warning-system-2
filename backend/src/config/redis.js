const Redis = require('ioredis');
const { redis } = require('./env');

let redisClient = null;
let isRedisAvailable = false;

try {
  redisClient = new Redis(redis.url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    connectTimeout: 5000,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 2000);
      console.warn(`[REDIS WARN] Connection attempt #${times}. Retrying in ${delay}ms...`);
      return delay;
    },
  });

  redisClient.on('connect', () => {
    console.log('[REDIS] Socket connected to Redis host');
  });

  redisClient.on('ready', () => {
    isRedisAvailable = true;
    console.log('[REDIS] Redis instance ready for operations');
  });

  redisClient.on('error', (err) => {
    isRedisAvailable = false;
    console.error(`[REDIS ERROR] Connection issue: ${err.message}`);
  });

  redisClient.on('close', () => {
    isRedisAvailable = false;
    console.warn('[REDIS WARN] Redis socket connection closed');
  });
} catch (err) {
  console.error(`[REDIS FATAL] Failed to initialize Redis client: ${err.message}`);
}

const cache = {
  get: async (key) => {
    if (!isRedisAvailable || !redisClient) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[REDIS READ ERROR] Key: ${key} | Message: ${err.message}`);
      return null;
    }
  },

  set: async (key, value, arg3 = 300, arg4) => {
    if (!isRedisAvailable || !redisClient) return false;
    try {
      // Gracefully handle both signatures:
      // 1. cache.set(k, v, 600)
      // 2. cache.set(k, v, 'EX', 600)
      let ttl = 300;
      if (typeof arg3 === 'number') {
        ttl = arg3;
      } else if (arg3 === 'EX' && typeof arg4 === 'number') {
        ttl = arg4;
      }

      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await redisClient.set(key, serialized, 'EX', ttl);
      return true;
    } catch (err) {
      console.error(`[REDIS WRITE ERROR] Key: ${key} | Message: ${err.message}`);
      return false;
    }
  },

  del: async (key) => {
    if (!isRedisAvailable || !redisClient) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      console.error(`[REDIS DEL ERROR] Key: ${key} | Message: ${err.message}`);
      return false;
    }
  },

  status: () => isRedisAvailable,
};

module.exports = cache;