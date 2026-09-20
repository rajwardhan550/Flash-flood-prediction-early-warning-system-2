import React from 'react';
import { TrendingUp, Droplets, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const PriorityZonesTable = ({ zones = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg">
        <span className="text-slate-400">{t('common.loading') || 'Loading priority zones...'}</span>
      </div>
    );
  }

  // Authoritative sorting: highest backend risk score surfaces to the top
  const sortedZones = [...zones].sort((a, b) => (b.risk?.score || 0) - (a.risk?.score || 0));

  const getTierColor = (tier) => {
    switch (tier) {
      case 'EXTREME': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'MODERATE': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
        <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
          <tr>
            <th className="px-4 py-3">{t('common.location') || 'Location'}</th>
            <th className="px-4 py-3">{t('authority.riskTier') || 'Risk Tier'}</th>
            <th className="px-4 py-3">{t('authority.riskScore') || 'Risk Score'}</th>
            <th className="px-4 py-3">{t('weather.rainfall') || 'Rainfall (24h)'}</th>
            <th className="px-4 py-3">{t('weather.waterLevel') || 'Water Level'}</th>
            <th className="px-4 py-3 text-right">{t('common.action') || 'Action'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {sortedZones.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                {t('authority.noZones') || 'No active zones monitored at this time.'}
              </td>
            </tr>
          ) : (
            sortedZones.map((zone) => (
              <tr key={zone.zoneId || zone._id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  {zone.name}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded border text-xs font-bold ${getTierColor(zone.risk?.tier)}`}>
                    {t(`risk.${zone.risk?.tier}`) || zone.risk?.tier || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={zone.risk?.score >= 75 ? 'text-rose-400' : 'text-slate-300'}>
                      {zone.risk?.score || 0}/100
                    </span>
                    {zone.risk?.trend === 'rising' && <TrendingUp className="w-3 h-3 text-rose-500" />}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono">
                  {zone.telemetry?.rainfall?.toFixed(1) || '0.0'} mm
                </td>
                <td className="px-4 py-3 font-mono flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  {zone.telemetry?.waterLevel?.toFixed(2) || '0.00'} m
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-blue-400 hover:text-blue-300 text-xs font-medium px-3 py-1.5 bg-blue-900/20 rounded border border-blue-800/30 transition-colors">
                    {t('common.viewDetails') || 'View Details'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityZonesTable;