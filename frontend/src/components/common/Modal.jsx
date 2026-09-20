import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50 rounded-t-xl shrink-0">
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;