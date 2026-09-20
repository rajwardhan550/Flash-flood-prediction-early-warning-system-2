import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    // Initializing with core testing locations for the frontend shell
    const defaults = [
      { id: '1', name: 'Chamoli', district: 'Chamoli District', state: 'Uttarakhand', coordinates: [30.4852, 79.6974] },
      { id: '2', name: 'Rishikesh', district: 'Dehradun District', state: 'Uttarakhand', coordinates: [30.0869, 78.2676] },
      { id: '3', name: 'Joshimath', district: 'Chamoli District', state: 'Uttarakhand', coordinates: [30.5506, 79.5660] }
    ];
    setAvailableLocations(defaults);
    setCurrentLocation(defaults[0]);
  }, []);

  return (
    <LocationContext.Provider value={{ currentLocation, availableLocations, setLocation: setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};