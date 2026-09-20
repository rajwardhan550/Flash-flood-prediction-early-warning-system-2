/**
 * Maps risk levels to specific Tailwind text colors for UI components.
 */
export const getRiskTextColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'severe': return 'text-rose-500';
    case 'high': return 'text-orange-500';
    case 'moderate': return 'text-amber-400';
    case 'low': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
};

/**
 * Maps risk levels to specific Tailwind background and border colors for badges/cards.
 */
export const getRiskBgColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'severe': return 'bg-rose-500/10 border-rose-500/30 text-rose-500';
    case 'high': return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
    case 'moderate': return 'bg-amber-400/10 border-amber-400/30 text-amber-400';
    case 'low': return 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400';
    default: return 'bg-slate-800 border-slate-700 text-slate-400';
  }
};

/**
 * Maps risk levels to Hex codes strictly for Leaflet map polygons and Chart.js instances.
 */
export const getRiskHexColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'severe': return '#f43f5e'; // tailwind rose-500
    case 'high': return '#f97316';   // tailwind orange-500
    case 'moderate': return '#fbbf24'; // tailwind amber-400
    case 'low': return '#34d399';    // tailwind emerald-400
    default: return '#94a3b8';       // tailwind slate-400
  }
};