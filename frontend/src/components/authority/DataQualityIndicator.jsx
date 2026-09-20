import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const DataQualityIndicator = ({ qualityScore = 100, lastUpdated }) => {
  const { t } = useLanguage();

  let status = 'GOOD';
  let Icon = CheckCircle2;
  let colorClass = 'text-emerald-500';
  let bgClass = 'bg-emerald-500/10';
  let borderClass = 'border-emerald-500/20';

  if (qualityScore < 50) {
    status = 'POOR';
    Icon = XCircle;
    colorClass = 'text-rose-500';
    bgClass = 'bg-rose-500/10';
    borderClass = 'border-rose-500/20';
  } else if (qualityScore < 85) {
    status = 'DEGRADED';
    Icon = AlertCircle;
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500/10';
    borderClass = 'border-amber-500/20';
  }

  const formattedTime = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString(t('common.localeCode') || 'en-IN', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border bg-slate-900 ${bgClass} ${borderClass}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <div>
          <p className="text-sm font-medium text-slate-200">
            {t('authority.dataQuality') || 'Telemetry Quality'}
          </p>
          <p className={`text-xs font-bold mt-0.5 ${colorClass}`}>
            {t(`quality.${status}`) || status} ({qualityScore}%)
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 mb-0.5">{t('common.lastUpdated') || 'Last Updated'}</p>
        <p className="text-sm font-mono text-slate-300">{formattedTime}</p>
      </div>
    </div>
  );
};

export default DataQualityIndicator;