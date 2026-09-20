import React from 'react';
import { BrainCircuit, RefreshCw, Settings2 } from 'lucide-react';
import Button from '../../components/common/Button';

const MLModelsManagement = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">ML Engine Management</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor Bi-LSTM and XGBoost ensemble performance and trigger retraining.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2 shrink-0">
          <RefreshCw className="w-4 h-4" /> Sync Metrics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Bi-LSTM Model Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-4 border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">Bi-LSTM (Temporal)</h3>
                <p className="text-xs text-slate-400">Time-series telemetry prediction</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
              Awaiting API
            </span>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex justify-between"><span>Active Version:</span> <span className="font-mono text-slate-200">--</span></div>
            <div className="flex justify-between"><span>Last Retrained:</span> <span className="font-mono text-slate-200">--</span></div>
            <div className="flex justify-between"><span>Accuracy (F1):</span> <span className="font-mono text-slate-200">--</span></div>
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-5 flex items-center justify-center gap-2">
            <Settings2 className="w-4 h-4" /> Configure Parameters
          </Button>
        </div>

        {/* Placeholder for XGBoost Model Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-4 border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">XGBoost (Spatial)</h3>
                <p className="text-xs text-slate-400">Terrain and vulnerability analysis</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
              Awaiting API
            </span>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex justify-between"><span>Active Version:</span> <span className="font-mono text-slate-200">--</span></div>
            <div className="flex justify-between"><span>Last Retrained:</span> <span className="font-mono text-slate-200">--</span></div>
            <div className="flex justify-between"><span>Accuracy (F1):</span> <span className="font-mono text-slate-200">--</span></div>
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-5 flex items-center justify-center gap-2">
            <Settings2 className="w-4 h-4" /> Configure Parameters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MLModelsManagement;