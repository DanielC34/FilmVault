
import React from 'react';
import { ICONS } from '../constants';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-6 scale-110 shadow-inner">
        <div className="scale-150">{icon || ICONS.Film}</div>
      </div>
      <h3 className="text-white font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-white/40 text-xs font-medium max-w-[240px] leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
