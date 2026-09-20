import React from 'react';
import AlertCard from './AlertCard';
import { useLanguage } from '../../hooks/useLanguage';
import Spinner from '../common/Spinner';

const AlertList = ({ alerts = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 border border-slate-800 rounded-lg bg-slate-900/30">
        <Spinner className="w-6 h-6 text-blue-500 mr-3" />
        <span className="text-slate-400">{t('common.loading') || 'Loading alerts...'}</span>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-800 rounded-lg bg-slate-900/30">
        <p className="text-slate-400">
          {t('alerts.noActiveAlerts') || 'There are currently no active alerts for this region.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {alerts.map((alert) => (
        <AlertCard key={alert._id || alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertList;