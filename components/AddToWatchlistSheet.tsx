
import React from 'react';
import { Watchlist, Movie } from '../types';
import { ICONS, TMDB_IMAGE_BASE, POSTER_SIZE } from '../constants';

interface AddToWatchlistSheetProps {
  movie: Movie;
  watchlists: Watchlist[];
  onAdd: (watchlistId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
}

const AddToWatchlistSheet: React.FC<AddToWatchlistSheetProps> = ({ movie, watchlists, onAdd, onClose, onCreateNew }) => {
  const posterUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-[#1a2128] w-full max-w-2xl rounded-t-[40px] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 border-t border-white/10 relative overscroll-none">
        {/* Handle for visual swipe cue */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        
        <div className="flex gap-5 mb-8 px-2">
          <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl flex-shrink-0 bg-[#2c343c] border border-white/10">
            <img 
              src={posterUrl} 
              className="w-full h-full object-cover"
              alt={movie.title}
              onError={(e: any) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster'; }}
            />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="text-[#00e054] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Add to Archive</span>
            <h2 className="text-2xl font-black text-white leading-tight">{movie.title}</h2>
            <p className="text-white/40 text-xs font-medium mt-1">Select a vault or create a new one.</p>
          </div>
        </div>

        {/* Scrollable List Container */}
        <div className="relative">
          <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar pb-6 overscroll-contain touch-pan-y">
            {watchlists.length > 0 ? (
              watchlists.map(list => (
                <button
                  key={list.id}
                  onClick={() => onAdd(list.id)}
                  className="w-full flex items-center justify-between p-5 rounded-[22px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black/40 rounded-xl text-[#00e054] shadow-inner">
                      {ICONS.List}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white text-base group-hover:text-[#00e054] transition-colors">{list.title}</h4>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{list.item_count || 0} ITEMS STORED</p>
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:text-white transition-colors">
                    {ICONS.Plus}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center bg-black/20 rounded-3xl border border-dashed border-white/5">
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No Vaults Found</p>
              </div>
            )}
            
            <button 
              onClick={onCreateNew}
              className="w-full flex items-center gap-4 p-5 rounded-[22px] border-2 border-dashed border-white/10 text-white/40 hover:text-[#00e054] hover:border-[#00e054]/50 transition-all group active:scale-[0.98]"
            >
              <div className="p-3 border-2 border-dashed border-current rounded-xl group-hover:scale-110 transition-transform">
                {ICONS.Plus}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm uppercase tracking-widest">Construct New Vault</h4>
                <p className="text-[10px] font-medium opacity-60">Create and add this movie instantly.</p>
              </div>
            </button>
          </div>
          
          {/* Subtle bottom fade to indicate scroll */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1a2128] to-transparent pointer-events-none" />
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-5 rounded-2xl bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AddToWatchlistSheet;
