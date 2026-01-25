
import React from 'react';
import { ICONS } from '../constants';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 mb-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1a2128] border border-white/5 text-white/40 hover:text-[#00e054] hover:border-[#00e054]/30 disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:border-white/5 transition-all active:scale-95"
        >
          <div className="rotate-180 scale-75">{ICONS.ChevronRight}</div>
        </button>

        <div className="bg-[#1a2128] border border-white/5 px-6 py-3 rounded-2xl">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            Page <span className="text-[#00e054]">{currentPage}</span> of {totalPages}
          </span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1a2128] border border-white/5 text-white/40 hover:text-[#00e054] hover:border-[#00e054]/30 disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:border-white/5 transition-all active:scale-95"
        >
          <div className="scale-75">{ICONS.ChevronRight}</div>
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#00e054] border-t-transparent rounded-full animate-spin" />
          <span className="text-[8px] font-black text-[#00e054] uppercase tracking-widest">Accessing Archive</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
