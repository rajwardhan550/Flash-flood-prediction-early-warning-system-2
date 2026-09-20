import React from 'react';
import { Activity, Wifi, Settings2 } from 'lucide-react';
import Button from '../../components/common/Button';

const SensorNetwork = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Local Sensor Network</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor the operational status of IoT telemetry nodes in your jurisdiction.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2 shrink-0">
          <Settings2 className="w-4 h-4" /> Run Diagnostics
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Sensor ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location (Village/Block)</th>
              <th className="px-4 py-3">Last Ping</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <tr>
              <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                <Activity className="w-8 h-8 mx-auto mb-3 text-slate-700" />
                <p>Awaiting sensor registry data for this assigned zone.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorNetwork;