
import React from 'react';
import { useStore } from '../../store/useStore';
import MovieCard from '../MovieCard';
import { MovieCardSkeleton } from '../Skeletons';
import Pagination from '../Pagination';
import { TMDB_IMAGE_BASE, BACKDROP_SIZE } from '../../constants';
import { Movie } from '../../types';

interface HomeTabProps {
  filter: "all" | "movies" | "tv";
  onFilterChange: (filter: "all" | "movies" | "tv") => void;
  onMovieClick: (movie: Movie) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ filter, onFilterChange, onMovieClick }) => {
  const { 
    trendingMovies, 
    isInitialLoading, 
    isNavigating,
    trendingPage, 
    totalTrendingPages, 
    setTrendingPage 
  } = useStore();

  const isHomeLoading = isInitialLoading && trendingMovies.length === 0;

  const filteredMovies = trendingMovies.filter((m) => {
    if (filter === "all") return true;
    if (filter === "movies") return m.media_type === "movie";
    if (filter === "tv") return m.media_type === "tv";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      <div className="px-4 py-2">
        <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          Trending Now
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
          {isHomeLoading
            ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-[85vw] h-48 rounded-2xl bg-[#1a2128] relative overflow-hidden flex-shrink-0"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
              </div>
            ))
            : trendingMovies.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                className="w-[85vw] flex-shrink-0 group"
              >
                <button
                  onClick={() => onMovieClick(movie)}
                  className="w-full h-48 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 text-left"
                >
                  <img
                    src={
                      movie.backdrop_path
                        ? `${TMDB_IMAGE_BASE}${BACKDROP_SIZE}${movie.backdrop_path}`
                        : `${TMDB_IMAGE_BASE}${BACKDROP_SIZE}${movie.poster_path}`
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={movie.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-white/60 text-xs font-bold mt-1 uppercase tracking-widest">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "TBA"}{" "}
                      • {movie.media_type.toUpperCase()}
                    </p>
                  </div>
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="px-4 flex gap-2">
        {["all", "movies", "tv"].map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f as any)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
              ? "bg-[#00e054] text-black shadow-lg shadow-[#00e054]/20"
              : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4">
        <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-left">
          Discovery Archive
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isHomeLoading
            ? [...Array(12)].map((_, i) => <MovieCardSkeleton key={i} />)
            : filteredMovies.map((movie) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type}`}
                movie={movie}
                onClick={onMovieClick}
              />
            ))}
        </div>
        <Pagination
          currentPage={trendingPage}
          totalPages={totalTrendingPages}
          onPageChange={async (page) => {
            await setTrendingPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          isLoading={isNavigating}
        />
      </div>
    </div>
  );
};

export default HomeTab;
