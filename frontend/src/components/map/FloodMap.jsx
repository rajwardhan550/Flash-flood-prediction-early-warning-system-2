import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../../hooks/useLanguage';
import MapLayerControls from './MapLayerControls';
import MapLegend from './MapLegend';
import RiskMarker from './RiskMarker';

// Fix for default Leaflet icon path issues in React/Vite builds
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const FloodMap = ({ zones = [], center = [30.4852, 79.6974], zoom = 10 }) => {
  const { t } = useLanguage();

  // Manage which layers are currently visible on the map
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    terrain: false,
    district: true,
    river: true,
    risk: true
  });

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => {
      const newState = { ...prev };
      // Handle base map mutually exclusive logic (Satellite vs Terrain)
      if (layerId === 'satellite') {
        newState.satellite = true;
        newState.terrain = false;
      } else if (layerId === 'terrain') {
        newState.terrain = true;
        newState.satellite = false;
      } else {
        // Toggle overlay layers independently
        newState[layerId] = !prev[layerId];
      }
      return newState;
    });
  };

  // Standard open-source tile providers for production-ready mapping without immediate API keys
  const SATELLITE_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const TERRAIN_TILES = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  const getActiveTileUrl = () => {
    if (activeLayers.satellite) return SATELLITE_TILES;
    if (activeLayers.terrain) return TERRAIN_TILES;
    return DARK_TILES;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
      
      {/* Custom Floating Overlays */}
      <MapLayerControls activeLayers={activeLayers} toggleLayer={toggleLayer} />
      <MapLegend />

      {/* Leaflet Map Instance */}
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false} // Disabled default to reposition it cleanly
        className="w-full h-full z-0"
      >
        <TileLayer
          url={getActiveTileUrl()}
          attribution='&copy; Esri, OpenTopoMap, OpenStreetMap contributors'
        />

        <ZoomControl position="topleft" />

        {/* Dynamically render high-risk backend zones as pulsating markers */}
        {activeLayers.risk && zones.map((zone) => (
          <RiskMarker key={zone.id || zone._id} zone={zone} />
        ))}
      </MapContainer>
    </div>
  );
};

export default FloodMap;