import React from 'react';
import { Droplets, CloudRain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const MapPopup = ({ zone }) => {
  const { t } = useLanguage();
  if (!zone) return null;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'EXTREME': return 'text-rose-600';
      case 'HIGH': return 'text-orange-600';
      case 'MODERATE': return 'text-amber-600';
      default: return 'text-emerald-600';
    }
  };

  return (
    <div className="p-1 min-w-[200px]">
      <h3 className="font-bold text-slate-800 text-sm mb-1">{zone.name}</h3>
      <p className="text-xs text-slate-500 mb-2 pb-2 border-b border-slate-200">
        {zone.district || 'Chamoli District'}
      </p>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-slate-600">Risk Level:</span>
        <span className={`text-xs font-bold ${getTierColor(zone.risk?.tier)}`}>
          {t(`risk.${zone.risk?.tier}`) || zone.risk?.tier || 'UNKNOWN'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded">
          <CloudRain className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-mono text-slate-700">
            {zone.telemetry?.rainfall?.toFixed(1) || '0.0'}mm
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded">
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-mono text-slate-700">
            {zone.telemetry?.waterLevel?.toFixed(2) || '0.0'}m
          </span>
        </div>
      </div>

      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors">
        {t('common.viewDetails') || 'View Details'}
      </button>
    </div>
  );
};

export default MapPopup;