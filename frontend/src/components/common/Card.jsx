import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;