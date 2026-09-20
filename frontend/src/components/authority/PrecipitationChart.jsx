import React from 'react';
import { CloudRain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const PrecipitationChart = ({ data = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg">
        <span className="text-slate-400">{t('common.loading') || 'Loading precipitation data...'}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500">
        <CloudRain className="w-8 h-8 mb-2 opacity-50" />
        <p>{t('authority.noChartData') || 'No historical telemetry available.'}</p>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    timeLabel: new Date(item.timestamp).toLocaleTimeString(t('common.localeCode') || 'en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-700 p-3 rounded shadow-lg">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-cyan-400 font-mono font-bold">
            {t('weather.rainfall') || 'Rainfall'}: {payload[0].value.toFixed(1)} mm
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6">
        <CloudRain className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('authority.precipitation') || 'Precipitation (Last 24h)'}
        </h3>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={12} tickMargin={10} minTickGap={30} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}mm`} />
            <Tooltip cursor={{ fill: '#1e293b' }} content={<CustomTooltip />} />
            <Bar 
              dataKey="rainfall" 
              fill="#22d3ee" 
              radius={[4, 4, 0, 0]} 
              isAnimationActive={false} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrecipitationChart;