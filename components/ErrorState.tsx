
import React from 'react';
import { ICONS } from '../constants';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "A cinematic glitch occurred.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500/40 mb-6 scale-110 shadow-inner border border-red-500/10">
        <div className="scale-150">{ICONS.X}</div>
      </div>
      <h3 className="text-white font-black uppercase tracking-[0.2em] mb-2">Signal Interrupted</h3>
      <p className="text-white/40 text-xs font-medium max-w-[240px] leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-8 px-8 py-3 bg-[#00e054] text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 shadow-lg shadow-[#00e054]/20"
        >
          Retry Transmission
        </button>
      )}
    </div>
  );
};

export default ErrorState;
