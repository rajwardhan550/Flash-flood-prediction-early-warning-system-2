const mongoose = require('mongoose');
const { mongo, env } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongo.uri, {
      maxPoolSize: 25,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[DATABASE ERROR] Runtime MongoDB connection failure: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DATABASE WARN] MongoDB disconnected. Attempting automatic reconnection...');
    });

    return conn;
  } catch (err) {
    console.error(`[DATABASE FATAL] Initial MongoDB connection refused: ${err.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[DATABASE] MongoDB connection closed safely.');
  } catch (err) {
    console.error(`[DATABASE ERROR] Error closing MongoDB connection: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };