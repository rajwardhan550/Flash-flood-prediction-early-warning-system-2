import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MapPopup from './MapPopup';

// Helper to create custom colored DivIcon for Leaflet
const createCustomIcon = (tier) => {
  let bgColor = 'bg-emerald-500';
  let shadowColor = 'shadow-emerald-500/50';

  if (tier === 'EXTREME') {
    bgColor = 'bg-rose-600';
    shadowColor = 'shadow-rose-600/50';
  } else if (tier === 'HIGH') {
    bgColor = 'bg-orange-500';
    shadowColor = 'shadow-orange-500/50';
  } else if (tier === 'MODERATE') {
    bgColor = 'bg-amber-500';
    shadowColor = 'shadow-amber-500/50';
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${bgColor} opacity-40"></div>
      <div class="relative inline-flex rounded-full h-3.5 w-3.5 ${bgColor} shadow-lg ${shadowColor} border border-white"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -12]
  });
};

const RiskMarker = ({ zone }) => {
  // Ensure we have valid coordinates before rendering the Leaflet marker
  if (!zone?.coordinates || zone.coordinates.length !== 2) return null;

  // Leaflet expects [lat, lng] format
  const position = [zone.coordinates[0], zone.coordinates[1]];
  const icon = createCustomIcon(zone.risk?.tier);

  return (
    <Marker position={position} icon={icon}>
      <Popup className="custom-popup border-0 p-0 rounded shadow-xl">
        <MapPopup zone={zone} />
      </Popup>
    </Marker>
  );
};

export default RiskMarker; 