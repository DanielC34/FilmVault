
import React from 'react';
import { useStore } from '../../store/useStore';
import { MovieCardSkeleton, VaultCardSkeleton } from '../Skeletons';
import EmptyState from '../EmptyState';
import { ICONS, TMDB_IMAGE_BASE, POSTER_SIZE } from '../../constants';
import { Movie, Watchlist, WatchlistItem } from '../../types';

interface ListsTabProps {
  viewingWatchlist: Watchlist | null;
  onOpenWatchlist: (watchlist: Watchlist) => void;
  onCloseWatchlist: () => void;
  onDeleteWatchlist: (id: string) => void;
  onMovieClick: (movie: Movie) => void;
  onCreateVault: () => void;
  vaultVibe: string;
}

const ListsTab: React.FC<ListsTabProps> = ({
  viewingWatchlist,
  onOpenWatchlist,
  onCloseWatchlist,
  onDeleteWatchlist,
  onMovieClick,
  onCreateVault,
  vaultVibe
}) => {
  const {
    watchlists,
    activeWatchlistItems,
    isNavigating,
    toggleWatchedStatus,
    removeFromWatchlist
  } = useStore();

  const sortedWatchlists = [...watchlists].sort((a, b) => {
    if (a.is_system_list) return -1;
    if (b.is_system_list) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="px-6 space-y-8 animate-in slide-in-from-right duration-500 pb-32">
      {!viewingWatchlist ? (
        <>
          <header className="py-4 text-left">
            <h2 className="text-3xl font-black text-white mb-2">
              My Vaults
            </h2>
            <div className="p-4 bg-[#1a2128] border border-white/5 rounded-2xl text-[11px] font-medium text-white/50 italic flex gap-3 items-start">
              <div className="text-[#00e054] mt-0.5">{ICONS.Sparkles}</div>
              <span>
                {vaultVibe || "Analyzing your cinematic taste..."}
              </span>
            </div>
          </header>

          <div className="space-y-4">
            {isNavigating && watchlists.length === 0 ? (
              [...Array(3)].map((_, i) => <VaultCardSkeleton key={i} />)
            ) : (
              <>
                {sortedWatchlists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => onOpenWatchlist(list)}
                    className={`w-full flex items-center justify-between p-6 rounded-[24px] bg-[#1a2128] border hover:border-white/20 hover:bg-[#2c343c]/30 transition-all group relative overflow-hidden shadow-xl ${list.title === "Favorites"
                      ? "border-[#ff8000]/30"
                      : (list.title === "Already Watched" || list.title === "Watched")
                        ? "border-[#00e054]/30"
                        : "border-white/5"
                      }`}
                  >
                    <div className="flex items-center gap-5 relative z-10 text-left">
                      <div
                        className={`w-14 h-14 bg-[#14181c] rounded-2xl flex items-center justify-center shadow-inner ${list.title === "Favorites"
                          ? "text-[#ff8000]"
                          : (list.title === "Already Watched" || list.title === "Watched")
                            ? "text-[#00e054]"
                            : "text-white/60"
                          }`}
                      >
                        {list.title === "Favorites"
                          ? ICONS.Heart
                          : (list.title === "Already Watched" || list.title === "Watched")
                            ? ICONS.Check
                            : ICONS.List}
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-black text-white group-hover:text-[#00e054] transition-colors">
                          {list.title}
                          {list.is_system_list && (
                            <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-white/5 text-white/30 rounded uppercase tracking-tighter">
                              Core
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">
                          {list.item_count || 0} ITEMS IN VAULT
                        </p>
                      </div>
                    </div>
                    <div className="text-white/10 group-hover:text-white/40 transition-colors relative z-10">
                      {ICONS.ChevronRight}
                    </div>
                  </button>
                ))}

                <button
                  onClick={onCreateVault}
                  className="w-full py-6 rounded-[24px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/30 hover:border-white/30 hover:text-white transition-all group"
                >
                  <div className="p-2 border-2 border-dashed border-current rounded-xl group-hover:scale-110 transition-transform">
                    {ICONS.Plus}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">
                    Construct New Vault
                  </span>
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-left duration-300">
          <header className="py-8 space-y-6">
            <button
              onClick={onCloseWatchlist}
              className="flex items-center gap-2 text-[#00e054] text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
            >
              <div className="rotate-180">{ICONS.ChevronRight}</div>
              Back to Vaults
            </button>

            <div className="flex justify-between items-start text-left">
              <div>
                <h2 className="text-4xl font-black text-white leading-tight">
                  {viewingWatchlist.title}
                </h2>
                <p className="text-white/40 text-sm font-medium mt-2 max-w-md">
                  {viewingWatchlist.description ||
                    "No description provided."}
                </p>
              </div>
              {!viewingWatchlist.is_system_list && (
                <button
                  onClick={() => onDeleteWatchlist(viewingWatchlist.id)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  {ICONS.Trash}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
              <span>{activeWatchlistItems.length} ITEMS</span>
              <span>•</span>
              <span>
                CREATED{" "}
                {new Date(viewingWatchlist.created_at).toLocaleDateString()}
              </span>
            </div>
          </header>

          <div className="flex flex-col gap-3 pb-32">
            {isNavigating ? (
              [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)
            ) : activeWatchlistItems.length > 0 ? (
              activeWatchlistItems.map((item: WatchlistItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#1a2128] p-3 rounded-2xl border border-white/5 active:bg-white/5 transition-colors"
                >
                  <button
                    onClick={() =>
                      onMovieClick({
                        id: item.media_id,
                        title: item.title,
                        overview: "",
                        poster_path: item.poster_path,
                        backdrop_path: "",
                        release_date: "",
                        vote_average: 0,
                        media_type: item.media_type,
                        watchlist_item_id: item.id,
                        is_watched: item.is_watched,
                      })
                    }
                    className="flex flex-1 items-center gap-4 text-left focus:outline-none group min-w-0"
                  >
                    <div
                      className={`w-16 h-24 rounded-lg overflow-hidden relative shadow-lg bg-[#2c343c] flex-shrink-0 transition-opacity duration-300 ${item.is_watched ? "opacity-40" : "opacity-100"}`}
                    >
                      <img
                        src={
                          item.poster_path
                            ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${item.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Poster"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.is_watched && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="p-1 bg-[#00e054] text-black rounded-full shadow-lg border-2 border-white/20 scale-75">
                            {ICONS.Check}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white truncate group-hover:text-[#00e054] transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                          {item.media_type}
                        </span>
                        {item.is_watched && (
                          <span className="text-[10px] font-black text-[#00e054] uppercase tracking-widest">
                            WATCHED
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 pr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchedStatus(item.id);
                      }}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${item.is_watched
                        ? "bg-[#00e054] text-black border-[#00e054]"
                        : "bg-[#14181c] text-white/40 border-white/10 hover:text-[#00e054] hover:border-[#00e054]/30"
                        }`}
                    >
                      <div className="scale-110">
                        {item.is_watched ? ICONS.Check : ICONS.Eye}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.id);
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500/60 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <div className="scale-110">{ICONS.X}</div>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState 
                title="Vault is Empty"
                description="Start adding movies from the feed or search to build your archive."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsTab;
