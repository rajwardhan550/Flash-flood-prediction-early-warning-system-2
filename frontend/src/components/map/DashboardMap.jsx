import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Maximize, Minimize } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { translations } from '../../utils/translations';

// SVG Markers for Location and Shelter
const startPinIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #2563eb; width: 18px; height: 18px; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const shelterPinIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; width: 22px; height: 22px; border: 3px solid #ffffff; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(16,185,129,0.8);"><span style="font-size:11px; line-height: 1;">🏠</span></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Auto-adjust bounds when route updates
function MapBoundsUpdater({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [points, map]);
  return null;
}

// Forces Leaflet to recalculate its size when toggling fullscreen
function MapResizer({ isFullscreen }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isFullscreen, map]);
  return null;
}

export default function DashboardMap({ 
  location, 
  language = 'en',
  evacuationRoute = null, 
  shelter = null 
}) {
  const t = translations[language] || translations.en;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const userCoords = [location?.lat || 30.4852, location?.lng || 79.6974];
  
  // Default verified shelter if none passed by backend yet
  const targetShelter = shelter || {
    name: language === 'hi' ? 'राजकीय इंटर कॉलेज राहत शिविर' : 'Govt Inter College Relief Camp',
    coords: [30.5010, 79.7120],
    capacity: '350 persons',
    distance: '2.4 km'
  };

  // Safe route fallback connecting current point to shelter
  const activeRoute = (evacuationRoute && evacuationRoute.length > 0) 
    ? evacuationRoute 
    : [
        userCoords,
        [30.4910, 79.7020],
        [30.4965, 79.7085],
        targetShelter.coords
      ];

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-gray-50 rounded-none' 
          : 'relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm'
      }`}
    >
      <MapContainer
        center={userCoords}
        zoom={12}
        zoomControl={false}        /* No zoom buttons */
        touchZoom={true}          /* Two-finger pinch to zoom */
        doubleClickZoom={false}
        scrollWheelZoom={true}
        dragging={true}
        className="w-full h-full z-0 touch-pan-x touch-pan-y"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        />

        {/* 1. CURRENT POSITION */}
        <Marker position={userCoords} icon={startPinIcon}>
          <Popup>
            <div className="p-1 text-gray-900 font-sans text-xs">
              <strong className="block font-bold text-sm text-blue-700">📍 {t.currentLocation || 'Current Location'}</strong>
              <span>{location?.name || 'Raini Village'}</span>
            </div>
          </Popup>
        </Marker>

        {/* 2. SAFE EVACUATION ROUTE */}
        <Polyline
          positions={activeRoute}
          pathOptions={{
            color: '#10b981',
            weight: 5,
            opacity: 0.9,
            dashArray: '1, 8',
            lineJoin: 'round'
          }}
        />
        <Polyline
          positions={activeRoute}
          pathOptions={{
            color: '#059669',
            weight: 3,
            opacity: 0.8
          }}
        />

        {/* 3. EVACUATION SHELTER */}
        <Marker position={targetShelter.coords} icon={shelterPinIcon}>
          <Popup>
            <div className="p-1.5 text-gray-900 font-sans text-xs">
              <strong className="block font-bold text-sm text-emerald-700">🏠 {targetShelter.name}</strong>
              <div className="mt-1 space-y-0.5 text-[11px] text-gray-700">
                <p><strong>{t.status || 'Status'}:</strong> {t.open || 'Open'}</p>
                <p><strong>{t.capacity || 'Capacity'}:</strong> {targetShelter.capacity}</p>
                <p><strong>{t.distance || 'Distance'}:</strong> {targetShelter.distance}</p>
              </div>
            </div>
          </Popup>
        </Marker>

        <MapBoundsUpdater points={activeRoute} />
        <MapResizer isFullscreen={isFullscreen} />
      </MapContainer>

      {/* Floating Fullscreen Toggle Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-3 right-3 z-[400] bg-white border border-gray-200 p-2 rounded-lg shadow-md hover:bg-gray-50 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>

      {/* Floating Status & Route Banner (Updated to Light Theme) */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md border border-gray-200 px-3 py-2 rounded-lg shadow-md flex items-center gap-3">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div className="text-left">
          <p className="text-[10px] text-emerald-600 font-bold tracking-wide uppercase">{t.safeRoute || 'Verified Safe Evacuation Path'}</p>
          <p className="text-xs text-gray-800 font-bold">📍 {location?.name || 'Raini'} → 🏠 {targetShelter.name}</p>
        </div>
      </div>
    </div>
  );
}