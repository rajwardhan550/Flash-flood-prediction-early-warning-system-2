import React from 'react';
import { Leaf, Droplets, AlertTriangle } from 'lucide-react';

const SoilMoisture = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Soil Moisture & Saturation</h1>
        <p className="text-slate-400 text-sm mt-1">Track soil saturation levels to assess runoff probability and landslide vulnerability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-slate-200">Saturation Index (%)</h2>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Droplets className="w-10 h-10 mb-3 text-slate-700" />
            <p>Awaiting localized soil sensor telemetry.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-4 pb-4 border-b border-slate-800">High Risk Thresholds</h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p>
              Soil saturation exceeding <strong>85%</strong> significantly increases the probability of rapid surface runoff. When combined with extreme precipitation rates, this triggers flash flood conditions.
            </p>
            <div className="p-4 bg-[#0a0a0a] border border-slate-800 rounded text-slate-500 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Currently, no active zones are reporting critical saturation levels. Establish hardware connectivity to begin live monitoring.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilMoisture;