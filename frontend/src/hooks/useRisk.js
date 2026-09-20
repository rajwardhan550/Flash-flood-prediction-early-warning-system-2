import { useState, useEffect } from 'react';
import { useLocationContext } from './useLocation';

export const useRisk = () => {
  const { currentLocation } = useLocationContext();
  const [riskData, setRiskData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRisk = async () => {
      // Temporarily bypassed the `!currentLocation?.id` check for frontend testing
      setIsLoading(true);
      
      try {
        // 1. Simulate network delay (remove this when backend is ready)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 2. Mock API Response matching your expected data structure
        const mockResponse = {
          currentRisk: {
            score: 82,
            level: 'HIGH',
            trend: 'increasing'
          },
          predictionBreakdown: {
            rainfallImpact: 45,
            soilSaturation: 30,
            riverLevel: 25
          },
          priorityZones: ['Raini Lower', 'Tapovan Market']
        };

        // 3. Set the states exactly as your production code does
        setRiskData(mockResponse.currentRisk);
        setPrediction(mockResponse.predictionBreakdown);
        setZones(mockResponse.priorityZones);
        
      } catch (err) {
        console.error('Risk API Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisk();
  }, [currentLocation]);

  return { riskData, prediction, zones, isLoading };
};