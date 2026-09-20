import React from 'react';
import { Map as MapIcon, Maximize } from 'lucide-react';
import FloodMap from '../../components/map/FloodMap';

const LiveRiskMap = () => {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col max-w-[1600px] mx-auto space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Live Risk Map</h1>
          <p className="text-slate-400 text-sm mt-1">Geospatial overview of active threats and sensor statuses.</p>
        </div>
        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm relative">
        {/* We mount the reusable FloodMap component here. 
            Once the API is ready, we will pass the fetched zone data into it. */}
        <FloodMap zones={[]} center={[30.4852, 79.6974]} zoom={9} />
        
        {/* Overlay for loading state */}
        <div className="absolute inset-0 z-[500] bg-slate-950/50 backdrop-blur-sm flex flex-col items-center justify-center text-slate-300 pointer-events-none">
          <MapIcon className="w-10 h-10 mb-3 text-slate-500 animate-pulse" />
          <p className="font-semibold">Loading regional boundary data...</p>
        </div>
      </div>
    </div>
  );
};

export default LiveRiskMap;