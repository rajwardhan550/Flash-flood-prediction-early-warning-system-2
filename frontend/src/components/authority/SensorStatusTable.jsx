import React from 'react';
import { Radio, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const SensorStatusTable = ({ sensors = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg">
        <span className="text-slate-400">{t('common.loading') || 'Loading sensor data...'}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950/50">
        <Radio className="w-5 h-5 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('authority.sensorNetwork') || 'Sensor Network Status'}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 text-xs border-b border-slate-800">
            <tr>
              <th className="px-4 py-2.5 font-medium">{t('common.id') || 'Sensor ID'}</th>
              <th className="px-4 py-2.5 font-medium">{t('common.type') || 'Type'}</th>
              <th className="px-4 py-2.5 font-medium">{t('authority.status') || 'Status'}</th>
              <th className="px-4 py-2.5 font-medium">{t('common.lastUpdated') || 'Last Reading'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sensors.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                  {t('authority.noSensors') || 'No sensors configured for this zone.'}
                </td>
              </tr>
            ) : (
              sensors.map((sensor) => (
                <tr key={sensor.sensorId || sensor._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs">{sensor.sensorId || sensor._id}</td>
                  <td className="px-4 py-2.5 text-slate-200 capitalize">{sensor.type?.replace('_', ' ')}</td>
                  <td className="px-4 py-2.5">
                    {sensor.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('common.online') || 'Online'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" /> {t('common.offline') || 'Offline'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-400">
                    {sensor.lastUpdated ? new Date(sensor.lastUpdated).toLocaleTimeString() : '--:--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorStatusTable;