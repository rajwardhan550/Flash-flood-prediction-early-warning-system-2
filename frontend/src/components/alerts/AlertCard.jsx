import React from 'react';
import { Clock, MapPin, Activity } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const AlertCard = ({ alert }) => {
  const { t } = useLanguage();

  if (!alert) return null;

  // Strict visual mapping tied to the backend risk tier
  const tierStyles = {
    EXTREME: {
      border: 'border-rose-600',
      bg: 'bg-rose-950/40',
      text: 'text-rose-400',
      icon: 'text-rose-500',
    },
    HIGH: {
      border: 'border-orange-500',
      bg: 'bg-orange-950/40',
      text: 'text-orange-400',
      icon: 'text-orange-500',
    },
    MODERATE: {
      border: 'border-amber-500',
      bg: 'bg-amber-950/40',
      text: 'text-amber-400',
      icon: 'text-amber-500',
    },
    LOW: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      icon: 'text-emerald-500',
    }
  };

  const style = tierStyles[alert.riskTier] || tierStyles.MODERATE;
  
  // Format timestamp consistently based on the active locale
  const formattedDate = new Date(alert.timestamp || alert.createdAt).toLocaleString(
    t('common.localeCode') || 'en-IN', 
    { dateStyle: 'medium', timeStyle: 'short' }
  );

  return (
    <div className={`p-4 rounded-lg border ${style.border} ${style.bg} transition-all shadow-sm flex flex-col gap-3`}>
      {/* Header: Location & Tier */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 ${style.icon}`} />
          <h3 className="text-lg font-semibold text-slate-100">
            {alert.zoneName || alert.location}
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded border ${style.border} ${style.text} bg-slate-900/50`}>
          {t(`risk.${alert.riskTier}`) || alert.riskTier}
        </span>
      </div>

      {/* Main Alert Message */}
      <p className="text-slate-300 text-sm leading-relaxed">
        {alert.message}
      </p>

      {/* Footer: Drivers & Timestamp */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2 pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Activity className="w-4 h-4" />
          <span>
            {/* Display real risk drivers if the backend provides them, else fallback to generic string */}
            {alert.drivers?.length 
              ? alert.drivers.join(' + ') 
              : t('alerts.modelPrediction') || 'Model Prediction'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;