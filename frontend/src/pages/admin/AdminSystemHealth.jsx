import React from 'react';
import { Server, Database, Activity, Cpu } from 'lucide-react';

const AdminSystemHealth = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">System Health</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time status of microservices and backend infrastructure.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
          <Server className="w-12 h-12 mb-3 text-slate-700 animate-pulse" />
          <p className="font-medium text-slate-300">Awaiting health check API integration.</p>
          <p className="text-sm mt-2 max-w-md mx-auto">
            This dashboard will dynamically render the uptime and latency for the Express.js API, MongoDB Clusters, Redis, and the Bi-LSTM/XGBoost prediction services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemHealth;