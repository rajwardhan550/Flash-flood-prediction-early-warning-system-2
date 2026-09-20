import React from 'react';
import { BrainCircuit, Activity } from 'lucide-react';

const Predictions = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">ML Predictions & Insights</h1>
        <p className="text-slate-400 text-sm mt-1">Review the Bi-LSTM temporal forecasts and XGBoost spatial risk factors.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <BrainCircuit className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-slate-200">Ensemble Model Outputs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/50 flex flex-col items-center justify-center h-48 text-slate-500">
            <Activity className="w-8 h-8 mb-2 opacity-50" />
            <span className="font-medium">Temporal Analysis Pending</span>
            <span className="text-xs mt-1">Awaiting time-series data feed</span>
          </div>
          <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/50 flex flex-col items-center justify-center h-48 text-slate-500">
            <Map className="w-8 h-8 mb-2 opacity-50" />
            <span className="font-medium">Spatial Analysis Pending</span>
            <span className="text-xs mt-1">Awaiting terrain metadata</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;