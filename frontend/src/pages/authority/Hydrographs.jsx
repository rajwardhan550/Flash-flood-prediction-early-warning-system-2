import React from 'react';
import { Waves, TrendingUp, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';

const Hydrographs = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">River Hydrographs</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor real-time water levels and discharge rates against danger marks.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4" /> Filter by Date
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-200">Water Level Trends (Last 72h)</h2>
          </div>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
            Awaiting CWC API
          </span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <TrendingUp className="w-12 h-12 mb-3 text-slate-700" />
          <p className="font-medium text-slate-300">No telemetry data available.</p>
          <p className="text-sm mt-2">The time-series chart will render once the sensor pipeline is connected.</p>
        </div>
      </div>
    </div>
  );
};

export default Hydrographs;