const axios = require('axios');
const logger = require('../utils/logger');

class OpenWeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  /**
   * Fetch real-time weather metrics from OpenWeather API.
   * Throws an error if credentials are missing or API fails.
   */
  async getLiveWeather(lat, lon) {
    if (!this.apiKey) {
      throw new Error('[OPENWEATHER] Missing OPENWEATHER_API_KEY in environment variables');
    }

    if (lat === undefined || lon === undefined) {
      throw new Error('[OPENWEATHER] Latitude and longitude are required');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        },
        timeout: 5000
      });

      const data = response.data;
      const rainfall_1h = data.rain ? (data.rain['1h'] || (data.rain['3h'] ? data.rain['3h'] / 3 : 0)) : 0;

      return {
        rainfall_mm: Number(Number(rainfall_1h).toFixed(2)),
        temperature_c: Number(data.main.temp),
        humidity_pct: Number(data.main.humidity)
      };
    } catch (error) {
      logger.error(`[OPENWEATHER] Failed to fetch weather for [${lat}, ${lon}]: ${error.message}`);
      throw new Error(`OpenWeather API request failed: ${error.message}`);
    }
  }

  async fetchCurrentWeather(lat, lon) {
    return this.getLiveWeather(lat, lon);
  }
}

module.exports = new OpenWeatherService();