import { useState, useEffect } from 'react';
import { useLocationContext } from './useLocation';

export const useTelemetry = () => {
  const { currentLocation } = useLocationContext();
  const [historicalData, setHistoricalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      
      try {
        // 1. Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 2. Mock API Response for charts and current conditions
        const mockResponse = {
          current: {
            rainfall: 45.2, // mm
            riverLevel: 104.5, // meters
            soilMoisture: 88, // percentage
            temperature: 24, // Celsius
            humidity: 92
          },
          history: [
            { time: '00:00', rainfall: 10, riverLevel: 102.1 },
            { time: '04:00', rainfall: 25, riverLevel: 102.8 },
            { time: '08:00', rainfall: 40, riverLevel: 103.5 },
            { time: '12:00', rainfall: 45, riverLevel: 104.5 }
          ]
        };

        setHistoricalData(mockResponse);
      } catch (err) {
        console.error('Telemetry API Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetry();
  }, [currentLocation]);

  return { historicalData, isLoading };
};