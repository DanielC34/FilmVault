
import React from 'react';
import { useStore } from '../../store/useStore';
import MovieCard from '../MovieCard';
import { MovieCardSkeleton } from '../Skeletons';
import Pagination from '../Pagination';
import EmptyState from '../EmptyState';
import { ICONS } from '../../constants';
import { Movie } from '../../types';

interface SearchTabProps {
  onMovieClick: (movie: Movie) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ onMovieClick }) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isNavigating,
    searchPage,
    totalSearchPages,
    setSearchPage,
    trendingMovies
  } = useStore();

  return (
    <div className="px-6 animate-in slide-in-from-left duration-500 pb-32">
      <div className="sticky top-20 z-30 pt-4 pb-6 bg-[#14181c]">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00e054] transition-colors">
            {ICONS.Search}
          </div>
          <input
            type="text"
            placeholder="Search the archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-5 bg-[#1a2128] border border-white/5 rounded-3xl text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-[#00e054]/30 focus:bg-[#1a2128] shadow-xl transition-all"
          />
        </div>
      </div>

      {searchQuery.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-left">
            {isNavigating && searchResults.length === 0
              ? [...Array(9)].map((_, i) => <MovieCardSkeleton key={i} />)
              : searchResults.map((movie) => (
                <MovieCard
                  key={`${movie.id}-${movie.media_type}`}
                  movie={movie}
                  onClick={onMovieClick}
                />
              ))}
            {!isNavigating &&
              searchQuery.length > 0 &&
              searchResults.length === 0 && (
                <div className="col-span-full">
                  <EmptyState 
                    icon={ICONS.Search}
                    title="No Matches Found"
                    description="We couldn't find anything matching your search in the archive."
                  />
                </div>
              )}
          </div>
          <Pagination
            currentPage={searchPage}
            totalPages={totalSearchPages}
            onPageChange={async (page) => {
              await setSearchPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isLoading={isNavigating}
          />
        </div>
      ) : (
        <div className="space-y-8 text-left">
          <section>
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Popular Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Noir",
                "Sci-Fi",
                "Horror",
                "Cyberpunk",
                "Giallo",
                "New Wave",
              ].map((genre) => (
                <button
                  key={genre}
                  className="px-5 py-3 rounded-2xl bg-[#1a2128] border border-white/5 text-xs font-bold text-white/60 hover:text-white transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Trending Today
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingMovies.slice(0, 3).map((movie) => (
                <MovieCard
                  key={`${movie.id}-discovery`}
                  movie={movie}
                  onClick={onMovieClick}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchTab;
