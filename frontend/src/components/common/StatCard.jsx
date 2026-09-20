import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, trendLabel, statusColor = 'text-blue-400' }) => {
  // Determine text colors based on the passed status string (e.g., 'High', 'Normal')
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('high') || s.includes('rising')) return 'text-rose-500';
    if (s.includes('moderate')) return 'text-amber-500';
    if (s.includes('normal') || s.includes('low')) return 'text-emerald-500';
    return 'text-slate-400';
  };

  const trendColor = getStatusStyle(trendLabel);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-slate-400">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <h4 className="text-sm font-medium text-slate-400">{title}</h4>
      </div>
      
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-100">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
        
        {trendLabel && (
          <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${trendColor}`}>
            {trendLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;