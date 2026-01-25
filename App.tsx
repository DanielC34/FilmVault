
import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import MovieCard from './components/MovieCard';
import MovieDetailModal from './components/MovieDetailModal';
import AddToWatchlistSheet from './components/AddToWatchlistSheet';
import CreateWatchlistModal from './components/CreateWatchlistModal';
import { Movie, Watchlist, WatchlistItem } from './types';
import { ICONS, THEME } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const { 
    init, 
    trendingMovies, 
    searchResults, 
    searchQuery, 
    setSearchQuery, 
    watchlists, 
    activeWatchlistItems,
    isLoading,
    addToWatchlist,
    createWatchlist,
    fetchWatchlistItems,
    removeFromWatchlist,
    deleteWatchlist,
    user
  } = useStore();

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'lists' | 'profile'>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showAddSheet, setShowAddSheet] = useState<Movie | null>(null);
  const [viewingWatchlist, setViewingWatchlist] = useState<Watchlist | null>(null);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [filter, setFilter] = useState<'all' | 'movies' | 'tv'>('all');
  const [vaultVibe, setVaultVibe] = useState<string>('');

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetchVibe = async () => {
      if (watchlists.length > 0) {
        const titles = watchlists.map(w => w.title);
        const vibe = await geminiService.getWatchlistSummary(titles);
        setVaultVibe(vibe);
      }
    };
    fetchVibe();
  }, [watchlists]);

  const handleAdd = async (listId: string) => {
    if (showAddSheet) {
      await addToWatchlist(listId, showAddSheet);
      setShowAddSheet(null);
    }
  };

  const handleCreateVault = async (title: string, description: string) => {
    await createWatchlist(title, description);
    setIsCreatingVault(false);
  };

  const openWatchlist = async (watchlist: Watchlist) => {
    await fetchWatchlistItems(watchlist.id);
    setViewingWatchlist(watchlist);
  };

  const handleDeleteVault = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vault? All saved items will be lost.')) {
      await deleteWatchlist(id);
      setViewingWatchlist(null);
    }
  };

  const filteredMovies = trendingMovies.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'movies') return m.media_type === 'movie';
    if (filter === 'tv') return m.media_type === 'tv';
    return true;
  });

  if (isLoading && activeTab !== 'lists' && trendingMovies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#14181c]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00e054] border-t-transparent rounded-full animate-spin" />
          <h2 className="text-[#00e054] font-black uppercase tracking-[0.3em]">FilmVault</h2>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setViewingWatchlist(null); }}>
      {/* Home / Feed View */}
      {activeTab === 'home' && (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Hero Section */}
          <div className="px-4 py-2">
            <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Trending Now</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
              {trendingMovies.slice(0, 5).map(movie => (
                <div key={movie.id} className="w-[85vw] flex-shrink-0 group">
                  <button 
                    onClick={() => setSelectedMovie(movie)}
                    className="w-full h-48 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 text-left"
                  >
                    <img 
                      src={movie.backdrop_path || movie.poster_path}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                      alt={movie.title}
                      onError={(e: any) => { e.target.src = 'https://via.placeholder.com/800x400?text=FilmVault'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-black text-white leading-tight">{movie.title}</h3>
                      <p className="text-white/60 text-xs font-bold mt-1 uppercase tracking-widest">
                        {movie.release_date} • {movie.media_type.toUpperCase()}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="px-4 flex gap-2">
            {['all', 'movies', 'tv'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-[#00e054] text-black shadow-lg shadow-[#00e054]/20' 
                    : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid Section */}
          <div className="px-4">
            <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Discovery</h2>
            <div className="grid grid-cols-3 gap-4">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vault / Lists View */}
      {activeTab === 'lists' && (
        <div className="px-6 space-y-8 animate-in slide-in-from-right duration-500">
          {!viewingWatchlist ? (
            <>
              <header className="py-4">
                <h2 className="text-3xl font-black text-white mb-2">My Vaults</h2>
                <div className="p-4 bg-[#1a2128] border border-white/5 rounded-2xl text-[11px] font-medium text-white/50 italic flex gap-3 items-start">
                   <div className="text-[#00e054] mt-0.5">{ICONS.Sparkles}</div>
                   <span>{vaultVibe || "Analyzing your cinematic taste..."}</span>
                </div>
              </header>

              <div className="space-y-4">
                {watchlists.map(list => (
                  <button 
                    key={list.id}
                    onClick={() => openWatchlist(list)}
                    className="w-full flex items-center justify-between p-6 rounded-[24px] bg-[#1a2128] border border-white/5 hover:border-white/20 hover:bg-[#2c343c]/30 transition-all group relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 bg-[#14181c] rounded-2xl flex items-center justify-center text-[#00e054] shadow-inner">
                        {ICONS.List}
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-black text-white group-hover:text-[#00e054] transition-colors">{list.title}</h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{list.item_count || 0} ITEMS IN VAULT</p>
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
                  <span className="text-xs font-black uppercase tracking-widest">Construct New Vault</span>
                </button>
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
                
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black text-white leading-tight">{viewingWatchlist.title}</h2>
                    <p className="text-white/40 text-sm font-medium mt-2 max-w-md">{viewingWatchlist.description || "No description provided."}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteVault(viewingWatchlist.id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                  >
                    {ICONS.Trash}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>{activeWatchlistItems.length} ITEMS</span>
                  <span>•</span>
                  <span>CREATED {new Date(viewingWatchlist.created_at).toLocaleDateString()}</span>
                </div>
              </header>

              {activeWatchlistItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 pb-32">
                  {activeWatchlistItems.map((item: WatchlistItem) => (
                    <div key={item.id} className="relative group">
                      <button 
                        onClick={() => setSelectedMovie({
                          id: item.media_id,
                          title: item.title,
                          overview: '',
                          poster_path: item.poster_path,
                          backdrop_path: '',
                          release_date: '',
                          vote_average: 0,
                          media_type: item.media_type
                        })}
                        className="w-full text-left focus:outline-none"
                      >
                        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden relative shadow-lg bg-[#2c343c]">
                          <img 
                            src={item.poster_path} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e: any) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster'; }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                               {ICONS.ChevronRight}
                             </div>
                          </div>
                        </div>
                        <h4 className="mt-2 text-[10px] font-bold text-white/80 truncate group-hover:text-white">{item.title}</h4>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(item.id);
                        }}
                        className="absolute -top-2 -right-2 p-1.5 bg-black/80 text-white/40 hover:text-red-500 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="scale-75 rotate-45">{ICONS.Plus}</div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 bg-white/5 rounded-full text-white/10">
                    <div className="scale-150">{ICONS.Film}</div>
                  </div>
                  <div>
                    <h3 className="text-white/40 font-black uppercase tracking-[0.2em]">Vault is Empty</h3>
                    <p className="text-white/20 text-xs font-medium mt-1">Start adding movies from the feed or search.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Profile / Me View */}
      {activeTab === 'profile' && user && (
        <div className="px-6 space-y-8 animate-in fade-in duration-500 text-center">
          <div className="pt-12 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#00e054] to-[#ff8000] mb-6 shadow-2xl">
              <img 
                src={user.avatar_url || ''} 
                className="w-full h-full rounded-full object-cover border-4 border-[#14181c]"
                alt={user.username}
              />
            </div>
            <h2 className="text-3xl font-black text-white">@{user.username}</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Executive Curator</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2128] p-6 rounded-3xl border border-white/5">
              <span className="text-3xl font-black text-white">124</span>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Movies Seen</p>
            </div>
            <div className="bg-[#1a2128] p-6 rounded-3xl border border-white/5">
              <span className="text-3xl font-black text-white">{watchlists.length}</span>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Active Vaults</p>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <button className="w-full p-5 rounded-2xl bg-white/5 text-white text-sm font-bold flex items-center justify-between">
              Account Settings
              <div className="text-white/20">{ICONS.ChevronRight}</div>
            </button>
            <button className="w-full p-5 rounded-2xl bg-white/5 text-white text-sm font-bold flex items-center justify-between">
              Privacy & Security
              <div className="text-white/20">{ICONS.ChevronRight}</div>
            </button>
            <button className="w-full p-5 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Search View */}
      {activeTab === 'search' && (
        <div className="px-6 animate-in slide-in-from-left duration-500">
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
             <div className="grid grid-cols-3 gap-4 pb-32">
               {searchResults.map(movie => (
                 <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
               ))}
               {searchResults.length === 0 && (
                 <div className="col-span-3 text-center py-20">
                    <p className="text-white/20 font-black uppercase tracking-[0.2em]">No Matches Found</p>
                 </div>
               )}
             </div>
           ) : (
             <div className="space-y-8 pb-32">
                <section>
                  <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Popular Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Noir', 'Sci-Fi', 'Horror', 'Cyberpunk', 'Giallo', 'New Wave'].map(genre => (
                      <button key={genre} className="px-5 py-3 rounded-2xl bg-[#1a2128] border border-white/5 text-xs font-bold text-white/60 hover:text-white transition-colors">
                        {genre}
                      </button>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Recent Discoveries</h3>
                   <div className="grid grid-cols-3 gap-4">
                    {trendingMovies.slice(0, 3).map(movie => (
                      <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
                    ))}
                  </div>
                </section>
             </div>
           )}
        </div>
      )}

      {/* Modals & Overlays */}
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
          watchlists={watchlists} 
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
    </Layout>
  );
};

export default App;
