
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useStore } from "./store/useStore";
import Layout from "./components/Layout";
import MovieDetailModal from "./components/MovieDetailModal";
import AddToWatchlistSheet from "./components/AddToWatchlistSheet";
import CreateWatchlistModal from "./components/CreateWatchlistModal";
import ConfirmationModal from "./components/ConfirmationModal";
import ToastNotification from "./components/ToastNotification";
import AuthScreen from "./components/AuthScreen";
import LoadingBar from "./components/LoadingBar";
import { MovieCardSkeleton, VaultCardSkeleton, ProfileSkeleton } from "./components/Skeletons";
import { Movie, Watchlist } from "./types";
import { geminiService } from "./services/geminiService";

// Lazy loaded tabs
const HomeTab = lazy(() => import("./components/tabs/HomeTab"));
const SearchTab = lazy(() => import("./components/tabs/SearchTab"));
const ListsTab = lazy(() => import("./components/tabs/ListsTab"));
const ProfileTab = lazy(() => import("./components/tabs/ProfileTab"));

const App: React.FC = () => {
  const {
    init,
    session,
    isInitialLoading,
    isNavigating,
    isRefreshing,
    trendingMovies,
    watchlists,
    addToWatchlist,
    createWatchlist,
    fetchWatchlistItems,
    deleteWatchlist,
    toggleWatchedStatus,
    removeFromWatchlist,
    toast,
    hideToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"home" | "search" | "lists" | "profile">("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showAddSheet, setShowAddSheet] = useState<Movie | null>(null);
  const [viewingWatchlist, setViewingWatchlist] = useState<Watchlist | null>(null);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [filter, setFilter] = useState<"all" | "movies" | "tv">("all");
  const [vaultVibe, setVaultVibe] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => { } });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetchVibe = async () => {
      if (watchlists.length > 0) {
        const titles = watchlists.map((w) => w.title).join(',');
        // Simple check to avoid repeated calls if titles haven't changed
        if ((window as any)._lastVibeTitles === titles) return;
        (window as any)._lastVibeTitles = titles;
        
        const vibe = await geminiService.getWatchlistSummary(watchlists.map(w => w.title));
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
        setConfirmDelete({ isOpen: false, title: "", description: "", onConfirm: () => { } });
      }
    });
  };

  if (isInitialLoading && !session) {
    return (
      <div className="min-h-screen bg-[#14181c] flex flex-col items-center justify-center animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-[#00e054] border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-white font-black text-xs uppercase tracking-[0.5em]">FilmVault</h2>
          <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em]">
            Initializing Secure Archive...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const sortedWatchlists = [...watchlists].sort((a, b) => {
    if (a.is_system_list) return -1;
    if (b.is_system_list) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setViewingWatchlist(null);
      }}
    >
      <LoadingBar isLoading={isNavigating || isRefreshing} />
      {toast && <ToastNotification toast={toast} onClose={hideToast} />}

      <Suspense fallback={
        <div className="px-6 space-y-8 animate-in fade-in duration-500">
          {activeTab === 'home' && <MovieCardSkeleton />}
          {activeTab === 'lists' && <VaultCardSkeleton />}
          {activeTab === 'profile' && <ProfileSkeleton />}
        </div>
      }>
        {activeTab === "home" && (
          <HomeTab 
            filter={filter} 
            onFilterChange={setFilter} 
            onMovieClick={setSelectedMovie} 
          />
        )}

        {activeTab === "search" && (
          <SearchTab onMovieClick={setSelectedMovie} />
        )}

        {activeTab === "lists" && (
          <ListsTab 
            viewingWatchlist={viewingWatchlist}
            onOpenWatchlist={openWatchlist}
            onCloseWatchlist={() => setViewingWatchlist(null)}
            onDeleteWatchlist={handleDeleteVault}
            onMovieClick={setSelectedMovie}
            onCreateVault={() => setIsCreatingVault(true)}
            vaultVibe={vaultVibe}
          />
        )}

        {activeTab === "profile" && <ProfileTab />}
      </Suspense>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isWatched={selectedMovie.is_watched}
          onToggleWatched={selectedMovie.watchlist_item_id ? () => toggleWatchedStatus(selectedMovie.watchlist_item_id!) : undefined}
          onRemove={selectedMovie.watchlist_item_id ? () => {
            removeFromWatchlist(selectedMovie.watchlist_item_id!);
            setSelectedMovie(null);
          } : undefined}
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
        onCancel={() => setConfirmDelete({ isOpen: false, title: "", description: "", onConfirm: () => { } })}
      />
    </Layout>
  );
};

export default App;
