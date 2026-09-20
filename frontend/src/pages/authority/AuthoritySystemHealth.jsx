import React from 'react';
import { Server } from 'lucide-react';

const AuthoritySystemHealth = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Local System Health</h1>
        <p className="text-slate-400 text-sm mt-1">Diagnostic status of telemetry pipelines in your assigned districts.</p>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 h-[400px]">
        <Server className="w-12 h-12 mb-3 text-slate-700 animate-pulse" />
        <p className="font-medium text-slate-300">Awaiting node diagnostics.</p>
        <p className="text-sm mt-2">Connecting to regional telemetry aggregators...</p>
      </div>
    </div>
  );
};

export default AuthoritySystemHealth;