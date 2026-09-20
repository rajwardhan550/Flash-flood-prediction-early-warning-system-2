import { useState, useEffect } from 'react';
import { useLocationContext } from './useLocation';

export const useWeather = () => {
  const { currentLocation } = useLocationContext();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentLocation?.coordinates) return;
      setIsLoading(true);
      try {
        const [lat, lng] = currentLocation.coordinates;
        // This will proxy to IMD or OpenWeatherMap through your backend
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        
        const data = await response.json();
        setCurrentWeather(data.current);
        setHourlyForecast(data.hourly || []);
        setDailyForecast(data.daily || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [currentLocation]);

  return { current: currentWeather, hourlyForecast, dailyForecast, isLoading };
};