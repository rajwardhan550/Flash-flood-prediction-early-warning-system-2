import React from 'react';
import { BrainCircuit, GitMerge } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const PredictionComparison = ({ prediction }) => {
  const { t } = useLanguage();

  if (!prediction) return null;

  const biLstmScore = Math.round((prediction.biLstm || 0) * 100);
  const xgboostScore = Math.round((prediction.xgboost || 0) * 100);
  const ensembleScore = Math.round((prediction.ensemble || 0) * 100);

  const getBarColor = (score) => {
    if (score >= 75) return 'bg-rose-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 25) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <BrainCircuit className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('authority.mlEnsemble') || 'ML Ensemble Breakdown'}
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Bi-LSTM (Dynamic/Temporal)</span>
            <span className="font-mono text-slate-200">{biLstmScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className={`h-2 rounded-full ${getBarColor(biLstmScore)} transition-all duration-500`} style={{ width: `${biLstmScore}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">XGBoost (Terrain/Vulnerability)</span>
            <span className="font-mono text-slate-200">{xgboostScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className={`h-2 rounded-full ${getBarColor(xgboostScore)} transition-all duration-500`} style={{ width: `${xgboostScore}%` }}></div>
          </div>
        </div>

        <div className="mt-2 pt-4 border-t border-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <GitMerge className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-200">
                {t('authority.finalProbability') || 'Final Probability'}
              </span>
            </div>
            <span className={`text-lg font-bold ${ensembleScore >= 75 ? 'text-rose-400' : 'text-slate-100'}`}>
              {ensembleScore}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className={`h-3 rounded-full ${getBarColor(ensembleScore)} transition-all duration-500`} style={{ width: `${ensembleScore}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionComparison;