import React from 'react';

const RiskGauge = ({ score = 0, size = 120, strokeWidth = 12 }) => {
  // SVG circle math
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - (score / 100) * circumference;

  // Determine color based on strict backend thresholds
  let colorClass = 'text-emerald-500';
  if (score >= 75) colorClass = 'text-rose-600';
  else if (score >= 50) colorClass = 'text-orange-500';
  else if (score >= 25) colorClass = 'text-amber-500';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background track */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-800"
        />
        {/* Animated value track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-out`}
        />
      </svg>
      
      {/* Center text */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-100 leading-none">{Math.round(score)}</span>
        <span className="text-xs text-slate-500 font-medium mt-1">/100</span>
      </div>
    </div>
  );
};

export default RiskGauge;