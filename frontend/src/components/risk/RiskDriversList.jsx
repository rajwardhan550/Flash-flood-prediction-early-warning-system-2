import React from 'react';
import { CloudRain, Waves, Leaf, Mountain, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const RiskDriversList = ({ telemetry, terrain }) => {
  const { t } = useLanguage();

  const drivers = [
    {
      id: 'rainfall',
      label: t('weather.rainfall') || 'Rainfall',
      icon: CloudRain,
      value: telemetry?.rainfall || 0,
      unit: 'mm',
      status: telemetry?.rainfallStatus || 'Normal',
      trend: 'up',
      color: 'text-blue-400'
    },
    {
      id: 'riverLevel',
      label: t('weather.riverLevel') || 'River Level',
      icon: Waves,
      value: telemetry?.waterLevel || 0,
      unit: 'm',
      status: telemetry?.waterLevelStatus || 'Normal',
      trend: 'up',
      color: 'text-cyan-400'
    },
    {
      id: 'soilMoisture',
      label: t('weather.soilMoisture') || 'Soil Moisture',
      icon: Leaf,
      value: telemetry?.soilMoisture || 0,
      unit: '%',
      status: telemetry?.soilMoistureStatus || 'Normal',
      trend: 'up',
      color: 'text-emerald-400'
    },
    {
      id: 'slope',
      label: t('weather.slope') || 'Slope',
      icon: Mountain,
      value: terrain?.slope || 0,
      unit: '°',
      status: terrain?.slopeStatus || 'Moderate',
      trend: 'flat',
      color: 'text-amber-400'
    }
  ];

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('high') || s.includes('rising')) return 'text-rose-500';
    if (s.includes('moderate')) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getTrendIcon = (trend, colorClass) => {
    if (trend === 'up') return <ArrowUp className={`w-3 h-3 ${colorClass}`} />;
    if (trend === 'down') return <ArrowDown className={`w-3 h-3 ${colorClass}`} />;
    return <Minus className={`w-3 h-3 ${colorClass}`} />;
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">
        {t('risk.keyFactors') || 'Key Risk Factors'}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-slate-900/50 border border-slate-800 rounded p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-2">
              <driver.icon className={`w-4 h-4 ${driver.color}`} />
              <span className="text-xs text-slate-400">{driver.label}</span>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100 flex items-baseline gap-1">
                {typeof driver.value === 'number' ? driver.value.toFixed(driver.id === 'riverLevel' ? 2 : 0) : driver.value}
                <span className="text-xs text-slate-500 font-medium">{driver.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-semibold">
                {getTrendIcon(driver.trend, getStatusColor(driver.status))}
                <span className={getStatusColor(driver.status)}>{driver.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDriversList;