
import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { ICONS, TMDB_IMAGE_BASE, BACKDROP_SIZE, POSTER_SIZE } from '../constants';
import { geminiService } from '../services/geminiService';
import { tmdbService } from '../services/tmdbService';
import { MovieDetailSkeleton } from './Skeletons';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onAddToWatchlist: (movie: Movie) => void;
  onCreateNewVault: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose, onAddToWatchlist, onCreateNewVault }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [fullMovie, setFullMovie] = useState<Movie>(movie);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      setLoadingDetails(true);
      const detailed = await tmdbService.getDetails(movie.id, movie.media_type);
      if (detailed) {
        setFullMovie(detailed);
      }
      setLoadingDetails(false);
    };

    const fetchInsight = async () => {
      setInsight('');
      setLoadingInsight(true);
      const text = await geminiService.getMovieInsight(movie.title);
      setInsight(text);
      setLoadingInsight(false);
    };

    fetchFullData();
    fetchInsight();
  }, [movie.id, movie.title, movie.media_type]);

  const backdropUrl = fullMovie.backdrop_path 
    ? `${TMDB_IMAGE_BASE}${BACKDROP_SIZE}${fullMovie.backdrop_path}`
    : `${TMDB_IMAGE_BASE}${BACKDROP_SIZE}${fullMovie.poster_path}`;

  const posterUrl = fullMovie.poster_path
    ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${fullMovie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#14181c] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[50vh] flex-shrink-0">
        <img 
          src={backdropUrl}
          className="w-full h-full object-cover transition-opacity duration-1000"
          alt={fullMovie.title}
          onError={(e: any) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/40 to-black/40" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-xl rounded-full text-white/80 hover:text-white transition-colors border border-white/10 z-20"
        >
          <div className="rotate-180">{ICONS.ChevronRight}</div>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 -mt-32 relative z-10 space-y-8 pb-32">
        {loadingDetails ? (
          <MovieDetailSkeleton />
        ) : (
          <>
            <div className="flex gap-6 items-end">
              <div className="w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0 bg-[#2c343c]">
                <img 
                    src={posterUrl}
                    className="w-full h-full object-cover"
                    alt={fullMovie.title}
                    onError={(e: any) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster'; }}
                  />
              </div>
              <div className="flex-1 pb-2 text-left">
                <h1 className="text-3xl font-black text-white leading-tight mb-1">{fullMovie.title}</h1>
                <div className="flex items-center gap-3 text-white/60 text-xs font-bold uppercase tracking-widest">
                  <span>{fullMovie.release_date ? new Date(fullMovie.release_date).getFullYear() : 'TBA'}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-[#ff8000]">
                    {ICONS.Star}
                    <span>{fullMovie.vote_average ? fullMovie.vote_average.toFixed(1) : 'NR'}</span>
                  </div>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px]">{fullMovie.media_type.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-[#1a2128] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group shadow-xl text-left">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00e054]" />
              <div className="flex items-center gap-2 text-[#00e054] text-[10px] font-black uppercase tracking-[0.2em]">
                {ICONS.Sparkles}
                <span>Vault Intelligence</span>
              </div>
              {loadingInsight ? (
                <div className="space-y-2">
                  <div className="h-3 bg-[#2c343c] rounded w-full animate-pulse" />
                  <div className="h-3 bg-[#2c343c] rounded w-4/5 animate-pulse" />
                </div>
              ) : (
                <p className="text-sm font-medium text-white/80 italic leading-relaxed">
                  "{insight}"
                </p>
              )}
            </div>

            <div className="space-y-4 text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">The Overview</h3>
              <p className="text-white/70 text-sm leading-relaxed font-medium">
                {fullMovie.overview || "No plot summary available for this title."}
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button 
              onClick={() => onAddToWatchlist(fullMovie)}
              disabled={loadingDetails}
              className="flex-1 py-4 px-6 bg-[#00e054] text-black font-black text-sm rounded-2xl shadow-xl shadow-[#00e054]/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {ICONS.Plus}
              ADD TO VAULT
            </button>
            <button className="p-4 bg-white/5 text-white/80 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              {ICONS.Heart}
            </button>
          </div>
          <button 
            onClick={onCreateNewVault}
            disabled={loadingDetails}
            className="w-full py-4 border-2 border-dashed border-white/10 text-white/40 font-bold rounded-2xl hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {ICONS.List}
            CREATE NEW VAULT
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
