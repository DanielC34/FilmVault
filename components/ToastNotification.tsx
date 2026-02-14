
import React from 'react';
import { Toast } from '../types';
import { ICONS } from '../constants';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={18} className="text-[#00e054]" />;
      case 'error': return <AlertCircle size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-[#00e054]/30';
      case 'error': return 'border-red-500/30';
      default: return 'border-blue-400/30';
    }
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`bg-[#1a2128]/95 backdrop-blur-xl border ${getBorderColor()} p-4 rounded-2xl shadow-2xl flex items-center gap-3 relative overflow-hidden`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 pr-6">
          <p className="text-sm font-bold text-white leading-tight">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 px-3 py-1 bg-[#00e054] text-black text-xs font-black rounded-lg hover:bg-[#00e054]/80 transition-colors uppercase tracking-wider"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 animate-toast-progress w-full" 
             style={{ color: toast.type === 'success' ? '#00e054' : toast.type === 'error' ? '#ef4444' : '#60a5fa' }} />
      </div>
    </div>
  );
};

export default ToastNotification;
