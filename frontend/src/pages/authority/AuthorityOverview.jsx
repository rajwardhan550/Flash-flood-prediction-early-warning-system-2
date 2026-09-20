import React from 'react';
import { Activity, Map, Radio, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { useLanguage } from '../../hooks/useLanguage';

const AuthorityOverview = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">{t('authority.dashboardTitle') || 'Command Center'}</h1>
        <p className="text-slate-400 text-sm mt-1">{t('authority.dashboardSubtitle') || 'Real-time monitoring and ML ensemble overview.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Priority Zones" value="--" icon={Map} statusColor="text-blue-400" />
        <StatCard title="Active Sensors" value="--" icon={Activity} statusColor="text-emerald-400" />
        <StatCard title="Pending Broadcasts" value="--" icon={Radio} statusColor="text-amber-400" />
        <StatCard title="Critical Alerts" value="--" icon={AlertTriangle} statusColor="text-rose-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-64 flex flex-col items-center justify-center text-slate-500">
          <Map className="w-8 h-8 mb-2 opacity-50" />
          <span>Live Risk Map (Awaiting Telemetry)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-64 flex flex-col items-center justify-center text-slate-500">
          <Activity className="w-8 h-8 mb-2 opacity-50" />
          <span>ML Ensemble Breakdown (Awaiting Data)</span>
        </div>
      </div>
    </div>
  );
};

export default AuthorityOverview;