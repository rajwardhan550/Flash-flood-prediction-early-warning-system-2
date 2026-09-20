import React from 'react';
import { Terminal, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const LogsViewer = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">System Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Raw server outputs, API traces, and error logs.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2 shrink-0">
          <RefreshCw className="w-4 h-4" /> Refresh Stream
        </Button>
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-slate-800 rounded-lg p-4 font-mono text-sm overflow-hidden flex flex-col shadow-inner">
        <div className="flex items-center gap-2 text-slate-500 mb-4 pb-2 border-b border-slate-800 shrink-0">
          <Terminal className="w-4 h-4" />
          <span>Live Tail: /var/log/floodatlas/system.log</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
          <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
          <p>WebSocket log stream disconnected.</p>
          <p className="text-xs mt-2">Waiting for backend integration...</p>
        </div>
      </div>
    </div>
  );
};

export default LogsViewer;