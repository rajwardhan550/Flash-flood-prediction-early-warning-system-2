import React from 'react';
import { Users, Activity, Database, ShieldAlert } from 'lucide-react';
import StatCard from '../../components/common/StatCard';

const AdminOverview = () => {
  // In a fully wired system, these stats will be fetched via a custom hook (e.g., useAdminStats)
  // For now, we render the empty structural shell.
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">System Overview</h1>
        <p className="text-slate-400 text-sm mt-1">High-level metrics for the Flood Early Warning System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Authorities" value="--" icon={Users} statusColor="text-blue-400" />
        <StatCard title="Active Sensors" value="--" icon={Activity} statusColor="text-emerald-400" />
        <StatCard title="System Health" value="Pending" icon={Database} statusColor="text-slate-400" />
        <StatCard title="Active Alerts" value="--" icon={ShieldAlert} statusColor="text-rose-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-64 flex flex-col items-center justify-center text-slate-500">
          <Activity className="w-8 h-8 mb-2 opacity-50" />
          <span>System Activity Chart (Awaiting Data)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-64 flex flex-col items-center justify-center text-slate-500">
          <Database className="w-8 h-8 mb-2 opacity-50" />
          <span>Recent Logs (Awaiting Data)</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;