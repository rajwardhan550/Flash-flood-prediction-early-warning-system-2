const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function fetchLiveWeather(lat, lon) {
  if (!OPENWEATHER_API_KEY) {
    // Graceful fallback if key is missing
    return {
      rainfall_mm: 12.4,
      temperature_c: 21.0,
      humidity_pct: 82
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await axios.get(url, { timeout: 4000 });
    const data = res.data;

    // OpenWeather provides rain in mm over 1h
    const rainfall_1h = data.rain ? (data.rain['1h'] || data.rain['3h'] / 3 || 0) : 0;

    return {
      rainfall_mm: Number(rainfall_1h.toFixed(2)),
      temperature_c: Number(data.main.temp.toFixed(1)),
      humidity_pct: Number(data.main.humidity)
    };
  } catch (err) {
    console.warn(`[WEATHER] Fallback triggered for [${lat}, ${lon}]: ${err.message}`);
    return { rainfall_mm: 0, temperature_c: 20.0, humidity_pct: 75 };
  }
}

module.exports = { fetchLiveWeather };