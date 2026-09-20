import React from 'react';
import { CloudRain, BarChart3 } from 'lucide-react';

const Precipitation = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Precipitation Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor cumulative rainfall and forecasted precipitation intensity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-200">Catchment Rainfall (mm)</h2>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <CloudRain className="w-10 h-10 mb-3 text-slate-700" />
            <p>Awaiting IMD (India Meteorological Department) API integration.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-4 pb-4 border-b border-slate-800">24h Accumulation</h2>
          <div className="space-y-4">
            {/* Skeletons for pending data */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-slate-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Precipitation;