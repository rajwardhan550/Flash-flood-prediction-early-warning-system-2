import { useState, useEffect } from 'react';
import { useLocationContext } from './useLocation';

export const useAlerts = () => {
  const { currentLocation } = useLocationContext();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!currentLocation?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/alerts/location/${currentLocation.id}`);
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError(err.message);
        setAlerts([]); // Graceful fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [currentLocation]);

  return { alerts, isLoading, error };
};