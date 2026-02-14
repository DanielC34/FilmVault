import React, { useEffect, useState } from "react";
import { useStore } from "./store/useStore";
import Layout from "./components/Layout";
import MovieCard from "./components/MovieCard";
import MovieDetailModal from "./components/MovieDetailModal";
import AddToWatchlistSheet from "./components/AddToWatchlistSheet";
import CreateWatchlistModal from "./components/CreateWatchlistModal";
import ConfirmationModal from "./components/ConfirmationModal";
import ToastNotification from "./components/ToastNotification";
import Pagination from "./components/Pagination";
import AuthScreen from "./components/AuthScreen";
import { MovieCardSkeleton, VaultCardSkeleton } from "./components/Skeletons";
import { Movie, Watchlist, WatchlistItem } from "./types";
import {
  ICONS,
  THEME,
  TMDB_IMAGE_BASE,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from "./constants";
import { geminiService } from "./services/geminiService";

const App: React.FC = () => {
  const {
    init,
    session,
    isAuthLoading,
    trendingMovies,
    searchResults,
    searchQuery,
    setSearchQuery,
    setTrendingPage,
    setSearchPage,
    trendingPage,
    totalTrendingPages,
    searchPage,
    totalSearchPages,
    watchlists,
    activeWatchlistItems,
    isLoading,
    addToWatchlist,
    createWatchlist,
    fetchWatchlistItems,
    removeFromWatchlist,
    deleteWatchlist,
    toggleWatchedStatus,
    user,
    toast,
    hideToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "home" | "search" | "lists" | "profile"
  >("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showAddSheet, setShowAddSheet] = useState<Movie | null>(null);
  const [viewingWatchlist, setViewingWatchlist] = useState<Watchlist | null>(
    null,
  );
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [filter, setFilter] = useState<"all" | "movies" | "tv">("all");
  const [vaultVibe, setVaultVibe] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => {} });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetchVibe = async () => {
      if (watchlists.length > 0) {
        const titles = watchlists.map((w) => w.title);
        const vibe = await geminiService.getWatchlistSummary(titles);
        setVaultVibe(vibe);
      }
    };
    if (session) fetchVibe();
  }, [watchlists, session]);

  const handleAdd = async (listId: string) => {
    if (showAddSheet) {
      await addToWatchlist(listId, showAddSheet);
      setShowAddSheet(null);
    }
  };

  const handleCreateVault = async (title: string, description: string) => {
    const newList = await createWatchlist(title, description);
    setIsCreatingVault(false);

    if (newList && showAddSheet) {
      await addToWatchlist(newList.id, showAddSheet);
      setShowAddSheet(null);
    }
  };

  const openWatchlist = async (watchlist: Watchlist) => {
    await fetchWatchlistItems(watchlist.id);
    setViewingWatchlist(watchlist);
  };

  const handleDeleteVault = async (id: string) => {
    const list = watchlists.find((w) => w.id === id);
    if (list?.is_system_list) {
      alert("System vaults cannot be deleted.");
      return;
    }
    setConfirmDelete({
      isOpen: true,
      title: "Delete vault?",
      description: "All saved items will be lost. This action cannot be undone.",
      onConfirm: async () => {
        await deleteWatchlist(id);
        setViewingWatchlist(null);
        setConfirmDelete({ isOpen: false, title: "", description: "", onConfirm: () => {} });
      }
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#14181c] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00e054] border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
          Vault Access Request
        </p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const filteredMovies = trendingMovies.filter((m) => {
    if (filter === "all") return true;
    if (filter === "movies") return m.media_type === "movie";
    if (filter === "tv") return m.media_type === "tv";
    return true;
  });

  const sortedWatchlists = [...watchlists].sort((a, b) => {
    if (a.is_system_list) return -1;
    if (b.is_system_list) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const isInitialLoading =
    isLoading && trendingMovies.length === 0 && activeTab === "home";

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setViewingWatchlist(null);
      }}
    >
      {toast && <ToastNotification toast={toast} onClose={hideToast} />}

      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-700 pb-32">
          <div className="px-4 py-2">
            <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              Trending Now
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
              {isInitialLoading
                ? [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[85vw] h-48 rounded-2xl bg-[#1a2128] animate-pulse flex-shrink-0"
                    />
                  ))
                : trendingMovies.slice(0, 10).map((movie) => (
                    <div
                      key={movie.id}
                      className="w-[85vw] flex-shrink-0 group"
                    >
                      <button
                        onClick={() => setSelectedMovie(movie)}
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
                          onError={(e: any) => {
                            e.target.src =
                              "https://via.placeholder.com/800x400?text=FilmVault";
                          }}
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
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f
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
            <div className="grid grid-cols-3 gap-4">
              {isLoading
                ? [...Array(12)].map((_, i) => <MovieCardSkeleton key={i} />)
                : filteredMovies.map((movie) => (
                    <MovieCard
                      key={`${movie.id}-${movie.media_type}`}
                      movie={movie}
                      onClick={setSelectedMovie}
                    />
                  ))}
            </div>
            <Pagination
              currentPage={trendingPage}
              totalPages={totalTrendingPages}
              onPageChange={setTrendingPage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {activeTab === "lists" && (
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
                {isLoading && watchlists.length === 0 ? (
                  [...Array(3)].map((_, i) => <VaultCardSkeleton key={i} />)
                ) : (
                  <>
                    {sortedWatchlists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => openWatchlist(list)}
                        className={`w-full flex items-center justify-between p-6 rounded-[24px] bg-[#1a2128] border hover:border-white/20 hover:bg-[#2c343c]/30 transition-all group relative overflow-hidden shadow-xl ${
                          list.title === "Favorites"
                            ? "border-[#ff8000]/30"
                            : list.title === "Already Watched"
                              ? "border-[#00e054]/30"
                              : "border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-5 relative z-10 text-left">
                          <div
                            className={`w-14 h-14 bg-[#14181c] rounded-2xl flex items-center justify-center shadow-inner ${
                              list.title === "Favorites"
                                ? "text-[#ff8000]"
                                : list.title === "Already Watched"
                                  ? "text-[#00e054]"
                                  : "text-white/60"
                            }`}
                          >
                            {list.title === "Favorites"
                              ? ICONS.Heart
                              : list.title === "Already Watched"
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
                      onClick={() => setIsCreatingVault(true)}
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
                  onClick={() => setViewingWatchlist(null)}
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
                      onClick={() => handleDeleteVault(viewingWatchlist.id)}
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

              <div className="grid grid-cols-3 gap-4 pb-32">
                {isLoading ? (
                  [...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)
                ) : activeWatchlistItems.length > 0 ? (
                  activeWatchlistItems.map((item: WatchlistItem) => (
                    <div
                      key={item.id}
                      className="relative group focus-within:ring-2 focus-within:ring-[#00e054] focus-within:rounded-xl"
                    >
                      <button
                        onClick={() =>
                          setSelectedMovie({
                            id: item.media_id,
                            title: item.title,
                            overview: "",
                            poster_path: item.poster_path,
                            backdrop_path: "",
                            release_date: "",
                            vote_average: 0,
                            media_type: item.media_type,
                          })
                        }
                        className="w-full text-left focus:outline-none"
                      >
                        <div
                          className={`aspect-[2/3] w-full rounded-lg overflow-hidden relative shadow-lg bg-[#2c343c] transition-opacity duration-300 ${item.is_watched ? "opacity-40" : "opacity-100"}`}
                        >
                          <img
                            src={
                              item.poster_path
                                ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${item.poster_path}`
                                : "https://via.placeholder.com/500x750?text=No+Poster"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e: any) => {
                              e.target.src =
                                "https://via.placeholder.com/500x750?text=No+Poster";
                            }}
                          />
                          {item.is_watched && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="p-2 bg-[#00e054] text-black rounded-full shadow-lg border-2 border-white/20 animate-in zoom-in-50">
                                {ICONS.Check}
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                        <h4 className="mt-2 text-[10px] font-bold text-white/80 truncate group-hover:text-white">
                          {item.title}
                        </h4>
                      </button>

                      <div className="absolute -top-1.5 -right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchedStatus(item.id);
                          }}
                          className={`p-1.5 rounded-full border shadow-xl transition-all ${
                            item.is_watched
                              ? "bg-[#00e054] text-black border-[#00e054]"
                              : "bg-[#14181c] text-white/60 border-white/10 hover:text-[#00e054]"
                          }`}
                          title={
                            item.is_watched
                              ? "Mark as unwatched"
                              : "Mark as watched"
                          }
                        >
                          <div className="scale-[0.85]">
                            {item.is_watched ? ICONS.Check : ICONS.Eye}
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist(item.id);
                          }}
                          className="p-1.5 bg-[#14181c] text-red-500 rounded-full border border-red-500/20 shadow-xl hover:bg-red-500 hover:text-white"
                          title="Remove from vault"
                        >
                          <div className="scale-[0.85]">{ICONS.X}</div>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-24 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-white/5 rounded-full text-white/10">
                      <div className="scale-150">{ICONS.Film}</div>
                    </div>
                    <div>
                      <h3 className="text-white/40 font-black uppercase tracking-[0.2em]">
                        Vault is Empty
                      </h3>
                      <p className="text-white/20 text-xs font-medium mt-1">
                        Start adding movies from the feed or search.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "search" && (
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
              <div className="grid grid-cols-3 gap-4 text-left">
                {isLoading && searchResults.length === 0
                  ? [...Array(9)].map((_, i) => <MovieCardSkeleton key={i} />)
                  : searchResults.map((movie) => (
                      <MovieCard
                        key={`${movie.id}-${movie.media_type}`}
                        movie={movie}
                        onClick={setSelectedMovie}
                      />
                    ))}
                {!isLoading &&
                  searchQuery.length > 0 &&
                  searchResults.length === 0 && (
                    <div className="col-span-3 text-center py-20">
                      <p className="text-white/20 font-black uppercase tracking-[0.2em]">
                        No Matches Found
                      </p>
                    </div>
                  )}
              </div>
              <Pagination
                currentPage={searchPage}
                totalPages={totalSearchPages}
                onPageChange={setSearchPage}
                isLoading={isLoading}
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
                <div className="grid grid-cols-3 gap-4">
                  {trendingMovies.slice(0, 3).map((movie) => (
                    <MovieCard
                      key={`${movie.id}-discovery`}
                      movie={movie}
                      onClick={setSelectedMovie}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {activeTab === "profile" && user && (
        <div className="px-6 space-y-8 animate-in fade-in duration-500 text-center pb-32">
          <div className="pt-12 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#00e054] to-[#ff8000] mb-6 shadow-2xl">
              <img
                src={user.avatar_url || ""}
                className="w-full h-full rounded-full object-cover border-4 border-[#14181c]"
                alt={user.username}
              />
            </div>
            <h2 className="text-3xl font-black text-white">@{user.username}</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">
              Executive Curator
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2128] p-6 rounded-3xl border border-white/5">
              <span className="text-3xl font-black text-white">124</span>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                Movies Seen
              </p>
            </div>
            <div className="bg-[#1a2128] p-6 rounded-3xl border border-white/5">
              <span className="text-3xl font-black text-white">
                {watchlists.length}
              </span>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                Active Vaults
              </p>
            </div>
          </div>
          <div className="space-y-3 text-left">
            <button className="w-full p-5 rounded-2xl bg-white/5 text-white text-sm font-bold flex items-center justify-between">
              Account Settings
              <div className="text-white/20">{ICONS.ChevronRight}</div>
            </button>
            <button
              onClick={() => useStore.getState().signOut()}
              className="w-full p-5 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onAddToWatchlist={(movie) => {
            setSelectedMovie(null);
            setShowAddSheet(movie);
          }}
          onCreateNewVault={() => {
            setSelectedMovie(null);
            setIsCreatingVault(true);
          }}
        />
      )}

      {showAddSheet && (
        <AddToWatchlistSheet
          movie={showAddSheet}
          watchlists={sortedWatchlists}
          onAdd={handleAdd}
          onClose={() => setShowAddSheet(null)}
          onCreateNew={() => {
            setIsCreatingVault(true);
          }}
        />
      )}

      {isCreatingVault && (
        <CreateWatchlistModal
          onClose={() => setIsCreatingVault(false)}
          onSave={handleCreateVault}
        />
      )}

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        description={confirmDelete.description}
        onConfirm={confirmDelete.onConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, title: "", description: "", onConfirm: () => {} })}
      />
    </Layout>
  );
};

export default App;
