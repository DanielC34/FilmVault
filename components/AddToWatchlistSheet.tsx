
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
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-[#1a2128] w-full max-w-2xl rounded-t-[32px] p-6 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/10">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
        
        <div className="flex gap-4 mb-8">
          <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-[#2c343c]">
            <img 
              src={posterUrl} 
              className="w-full h-full object-cover"
              alt={movie.title}
              onError={(e: any) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster'; }}
            />
          </div>
          <div className="flex flex-col justify-center text-left">
            <h2 className="text-xl font-bold text-white leading-tight">Add to Vault</h2>
            <p className="text-white/60 text-sm font-medium">{movie.title}</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {watchlists.map(list => (
            <button
              key={list.id}
              onClick={() => onAdd(list.id)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00e054]/10 rounded-lg text-[#00e054]">
                  {ICONS.List}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white text-sm">{list.title}</h4>
                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{list.item_count || 0} ITEMS</p>
                </div>
              </div>
              <div className="text-white/20 group-hover:text-[#00e054] transition-colors">
                {ICONS.Plus}
              </div>
            </button>
          ))}
        </div>
        
        <button 
          onClick={onCreateNew}
          className="mt-4 w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-all group"
        >
          <div className="p-2 border border-dashed border-current rounded-lg group-hover:scale-110 transition-transform">
            {ICONS.Plus}
          </div>
          <span className="font-bold text-sm">Create New Watchlist</span>
        </button>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddToWatchlistSheet;
