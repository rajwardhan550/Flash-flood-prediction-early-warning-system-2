import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import RiskGauge from './RiskGauge';

const RiskScoreCard = ({ riskData, lastUpdated }) => {
  const { t } = useLanguage();
  
  if (!riskData) return null;

  const { score, tier, summary, message } = riskData;

  const getTierStyles = (currentTier) => {
    switch (currentTier) {
      case 'EXTREME': return 'bg-rose-600/20 text-rose-500 border-rose-600/30';
      case 'HIGH': return 'bg-rose-600/20 text-rose-500 border-rose-600/30';
      case 'MODERATE': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    }
  };

  const formattedTime = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString(t('common.localeCode') || 'en-IN', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-100">
            {t('risk.predictionTitle') || 'Flood Risk Prediction'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-500 font-medium tracking-wide uppercase">LIVE</span>
          <span className="text-slate-500 ml-1">Last updated: {formattedTime}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <RiskGauge score={score} size={110} strokeWidth={10} />
        
        <div className="flex-1 text-center sm:text-left">
          <span className={`inline-block px-3 py-1 rounded text-sm font-bold uppercase tracking-wider border mb-3 ${getTierStyles(tier)}`}>
            {t(`risk.${tier}`) || tier} RISK
          </span>
          
          <h4 className="text-slate-200 font-semibold mb-2 flex items-start justify-center sm:justify-start gap-2 text-sm">
            {(tier === 'HIGH' || tier === 'EXTREME') && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
            {summary || 'Calculating specific risk probability...'}
          </h4>
          
          <p className="text-slate-400 text-xs leading-relaxed">
            {message || 'Awaiting dynamic risk factors from the ML ensemble.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreCard;