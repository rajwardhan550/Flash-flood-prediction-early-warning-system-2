import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none rounded';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <button 
      className={combinedClassName} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4 mr-2 text-current" />}
      {children}
    </button>
  );
};

export default Button;