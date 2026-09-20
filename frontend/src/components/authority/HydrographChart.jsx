import React from 'react';
import { Waves } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

const HydrographChart = ({ data = [], isLoading, dangerLevel = 3.0 }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg">
        <span className="text-slate-400">{t('common.loading') || 'Loading hydrograph data...'}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500">
        <Waves className="w-8 h-8 mb-2 opacity-50" />
        <p>{t('authority.noChartData') || 'No historical telemetry available for this time period.'}</p>
      </div>
    );
  }

  // Format timestamps for the X-axis
  const formattedData = data.map(item => ({
    ...item,
    timeLabel: new Date(item.timestamp).toLocaleTimeString(t('common.localeCode') || 'en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  // Custom Tooltip for dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-700 p-3 rounded shadow-lg">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-blue-400 font-mono font-bold">
            {t('weather.waterLevel') || 'Water Level'}: {payload[0].value.toFixed(2)} m
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6">
        <Waves className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('authority.hydrograph') || 'River Hydrograph (Last 24h)'}
        </h3>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#64748b" 
              fontSize={12} 
              tickMargin={10} 
              minTickGap={30}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Danger Level Reference Line */}
            {dangerLevel && (
              <ReferenceLine 
                y={dangerLevel} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ 
                  position: 'insideTopLeft', 
                  value: t('authority.dangerLevel') || 'Danger Level', 
                  fill: '#ef4444', 
                  fontSize: 11 
                }} 
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="waterLevel" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#1e293b', strokeWidth: 2 }}
              isAnimationActive={false} // Disable animation for faster real-time rendering
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HydrographChart;