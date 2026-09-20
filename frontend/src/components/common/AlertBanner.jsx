import React from 'react';
import { Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAlerts } from '../../hooks/useAlerts';

const AlertBanner = () => {
  const { t } = useLanguage();
  const { alerts } = useAlerts();

  // Filter only severe alerts based on actual backend data
  const highRiskAlerts = alerts?.filter(
    (alert) => alert.riskTier === 'HIGH' || alert.riskTier === 'EXTREME'
  ) || [];

  if (highRiskAlerts.length === 0) return null;

  return (
    <div className="w-full bg-[#2a1315] border-b border-red-900/30 flex items-center px-4 py-2 shadow-sm text-sm">
      <div className="flex items-center text-red-500 font-semibold mr-3 shrink-0">
        <Megaphone className="w-4 h-4 mr-2" />
        {t('alerts.highRiskAreas') || 'High Risk Areas:'}
      </div>

      <div className="flex-1 overflow-hidden whitespace-nowrap flex items-center text-slate-300">
        <div className="animate-marquee flex gap-3">
          {highRiskAlerts.map((alert, index) => (
            <React.Fragment key={alert.zoneId || index}>
              <span>
                {alert.zoneName}{' '}
                <span className="text-red-400">
                  ({t(`risk.${alert.riskTier}`) || alert.riskTier} Risk)
                </span>
              </span>
              {index < highRiskAlerts.length - 1 && (
                <span className="text-slate-600">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center text-slate-500 ml-4 shrink-0 gap-2">
        <button className="hover:text-slate-300 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="hover:text-slate-300 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;