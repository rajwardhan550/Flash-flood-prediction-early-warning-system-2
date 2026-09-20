import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

// EXPORTING EXACTLY WHAT APP.JSX IS ASKING FOR
export function LocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState({
    id: 'raini-01', 
    lat: 30.4852,
    lng: 79.6974,
    name: 'Raini Village',
    nameHi: 'रैणी गांव'
  });

  return React.createElement(
    LocationContext.Provider,
    { value: { currentLocation, setCurrentLocation } },
    children
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}