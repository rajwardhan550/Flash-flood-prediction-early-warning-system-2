import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const MapLegend = () => {
  const { t } = useLanguage();
  
  const legendItems = [
    { label: 'LOW', color: 'bg-emerald-500' },
    { label: 'MODERATE', color: 'bg-amber-500' },
    { label: 'HIGH', color: 'bg-orange-500' },
    { label: 'EXTREME', color: 'bg-rose-600' }
  ];

  return (
    <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg">
      <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
        {t('map.riskLevel') || 'Flood Risk Level'}
      </h4>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-xs text-slate-200">{t(`risk.${item.label}`) || item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;