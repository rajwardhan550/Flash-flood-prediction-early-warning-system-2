import React from 'react';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

const SoilMoistureChart = ({ data = [], isLoading, saturationThreshold = 85 }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg">
        <span className="text-slate-400">{t('common.loading') || 'Loading soil moisture data...'}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500">
        <Leaf className="w-8 h-8 mb-2 opacity-50" />
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
          <p className="text-emerald-400 font-mono font-bold">
            {t('weather.soilMoisture') || 'Soil Moisture'}: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('authority.soilMoistureChart') || 'Soil Moisture Saturation'}
        </h3>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={12} tickMargin={10} minTickGap={30} />
            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            
            {saturationThreshold && (
              <ReferenceLine 
                y={saturationThreshold} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ position: 'insideTopLeft', value: t('authority.saturationWarning') || 'High Saturation', fill: '#f59e0b', fontSize: 11 }} 
              />
            )}

            <Area 
              type="monotone" 
              dataKey="soilMoisture" 
              stroke="#34d399" 
              fillOpacity={1} 
              fill="url(#colorMoisture)" 
              strokeWidth={3}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoilMoistureChart;