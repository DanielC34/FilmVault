
import { create } from 'zustand';
import { AppState, Profile, Watchlist, WatchlistItem, Movie, Toast } from '../types';
import { supabaseMock } from '../services/supabaseMock';
import { tmdbService } from '../services/tmdbService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AppActions {
  init: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  loadUserData: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchPage: (page: number) => Promise<void>;
  setTrendingPage: (page: number) => Promise<void>;
  createWatchlist: (title: string, description: string) => Promise<Watchlist | undefined>;
  addToWatchlist: (watchlistId: string, movie: Movie) => Promise<void>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatchedStatus: (itemId: string) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  fetchWatchlistItems: (watchlistId: string) => Promise<void>;
  showToast: (message: string, type?: Toast['type']) => void;
  hideToast: () => void;
}

export const useStore = create<AppState & AppActions>((set, get) => ({
  user: null,
  session: null,
  isAuthLoading: true,
  watchlists: [],
  activeWatchlistItems: [],
  favoriteIds: new Set(),
  isLoading: false,
  searchQuery: '',
  searchResults: [],
  trendingMovies: [],
  trendingPage: 1,
  totalTrendingPages: 500,
  searchPage: 1,
  totalSearchPages: 1,
  toast: null,

  init: async () => {
    set({ isAuthLoading: true });
    
    const mockSession = localStorage.getItem('fv_mock_session');
    
    if (mockSession) {
      const session = JSON.parse(mockSession);
      set({ session, isAuthLoading: false });
      await get().loadUserData();
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session });
          if (session) get().loadUserData();
        });

        if (session) {
          set({ session });
          await get().loadUserData();
        }
      }
    } catch (e) {
      console.warn("Supabase connection failed. Falling back to Auth UI.");
    } finally {
      set({ isAuthLoading: false });
    }
  },

  loadUserData: async () => {
    set({ isLoading: true });
    try {
      const { session } = get();
      const userId = session?.user?.id;
      const user = await supabaseMock.getProfile(userId);
      const watchlists = await supabaseMock.getWatchlists();
      const favList = watchlists.find(w => w.is_system_list && w.title === 'Favorites');
      let favorites = new Set<string>();
      if (favList) {
        const items = await supabaseMock.getWatchlistItems(favList.id);
        favorites = new Set(items.map(i => i.media_id));
      }
      const trending = await tmdbService.getTrending(1);
      set({ user, watchlists, favoriteIds: favorites, trendingMovies: trending, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  signInAsGuest: async () => {
    set({ isAuthLoading: true });
    const fakeSession = { user: { id: 'user_123', email: 'guest@filmvault.app' }, access_token: 'mock_token' };
    localStorage.setItem('fv_mock_session', JSON.stringify(fakeSession));
    set({ session: fakeSession });
    await get().loadUserData();
    set({ isAuthLoading: false });
    get().showToast("Entered Vault in Developer Guest Mode.", "info");
  },

  signInWithPassword: async (email, password) => {
    if (!isSupabaseConfigured()) {
      set({ isAuthLoading: true });
      const fakeSession = { user: { id: `user_${Math.random().toString(36).substr(2, 9)}`, email }, access_token: 'mock_token' };
      localStorage.setItem('fv_mock_session', JSON.stringify(fakeSession));
      set({ session: fakeSession });
      await get().loadUserData();
      set({ isAuthLoading: false });
      get().showToast("Access granted (Mock Mode).");
      return true;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ session: data.session });
      get().showToast("Access granted. Welcome back.");
      return true;
    } catch (error: any) {
      get().showToast(error.message, "error");
      return false;
    }
  },

  signUpWithEmail: async (email, password) => {
    if (!isSupabaseConfigured()) {
      set({ isAuthLoading: true });
      const newUser = await supabaseMock.register(email);
      const fakeSession = { user: { id: newUser.id, email }, access_token: 'mock_token' };
      localStorage.setItem('fv_mock_session', JSON.stringify(fakeSession));
      set({ session: fakeSession });
      await get().loadUserData();
      set({ isAuthLoading: false });
      get().showToast("Vault initialized (Mock Mode).");
      return true;
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        set({ session: data.session });
        get().showToast("Vault initialized. Welcome.");
      } else {
        get().showToast("Verification email dispatched.", "info");
      }
      return true;
    } catch (error: any) {
      get().showToast(error.message, "error");
      return false;
    }
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) {
      await get().signInAsGuest();
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      get().showToast("Google Auth failed. Using Guest Mode instead.", "info");
      await get().signInAsGuest();
    }
  },

  signOut: async () => {
    localStorage.removeItem('fv_mock_session');
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    set({ session: null, user: null });
    get().showToast("Logged out of the vault.");
  },

  showToast: (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(7);
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 3000);
  },

  hideToast: () => set({ toast: null }),

  setSearchQuery: async (query: string) => {
    set({ searchQuery: query, searchPage: 1 });
    if (query.length > 2) {
      set({ isLoading: true });
      try {
        const results = await tmdbService.search(query, 1);
        set({ searchResults: results, isLoading: false });
      } catch (error) {
        set({ searchResults: [], isLoading: false });
      }
    } else {
      set({ searchResults: [] });
    }
  },

  setSearchPage: async (page: number) => {
    const { searchQuery } = get();
    if (!searchQuery) return;
    set({ isLoading: true, searchPage: page });
    try {
      const results = await tmdbService.search(searchQuery, page);
      set({ searchResults: results, isLoading: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setTrendingPage: async (page: number) => {
    set({ isLoading: true, trendingPage: page });
    try {
      const trending = await tmdbService.getTrending(page);
      set({ trendingMovies: trending, isLoading: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (movie: Movie) => {
    const { favoriteIds, watchlists } = get();
    const favList = watchlists.find(w => w.is_system_list && w.title === 'Favorites');
    if (!favList) return;
    const isFav = favoriteIds.has(String(movie.id));
    const newFavs = new Set(favoriteIds);
    if (isFav) newFavs.delete(String(movie.id));
    else newFavs.add(String(movie.id));
    set({ favoriteIds: newFavs });
    try {
      if (isFav) {
        await supabaseMock.removeMovieFromWatchlist(favList.id, String(movie.id));
        get().showToast(`Removed from Favorites.`);
      } else {
        await supabaseMock.addItemToWatchlist(favList.id, movie);
        get().showToast(`Added to Favorites.`);
      }
      const updatedWatchlists = await supabaseMock.getWatchlists();
      set({ watchlists: updatedWatchlists });
    } catch (error) {
      set({ favoriteIds });
      get().showToast('Failed to update favorites.', 'error');
    }
  },

  toggleWatchedStatus: async (itemId: string) => {
    try {
      const result = await supabaseMock.toggleWatchedStatus(itemId);
      const items = get().activeWatchlistItems.map(item => 
        item.id === itemId ? { ...item, is_watched: result } : item
      );
      set({ activeWatchlistItems: items });
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
      get().showToast(result ? "Archived in history." : "Returned to watchlist.");
    } catch (error) {
      get().showToast("Failed to update status.", "error");
    }
  },

  createWatchlist: async (title: string, description: string) => {
    try {
      const newList = await supabaseMock.createWatchlist(title, description);
      set(state => ({ watchlists: [...state.watchlists, newList] }));
      get().showToast(`Vault "${title}" created successfully.`);
      return newList;
    } catch (error) {
      get().showToast('Failed to create vault.', 'error');
      return undefined;
    }
  },

  addToWatchlist: async (watchlistId: string, movie: Movie) => {
    try {
      await supabaseMock.addItemToWatchlist(watchlistId, movie);
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
      const list = watchlists.find(w => w.id === watchlistId);
      get().showToast(`"${movie.title}" added to ${list?.title || 'vault'}.`);
    } catch (error) {
      get().showToast('Failed to add movie.', 'error');
    }
  },

  fetchWatchlistItems: async (watchlistId: string) => {
    set({ isLoading: true });
    try {
      const items = await supabaseMock.getWatchlistItems(watchlistId);
      set({ activeWatchlistItems: items, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  removeFromWatchlist: async (itemId: string) => {
    try {
      const item = get().activeWatchlistItems.find(i => i.id === itemId);
      await supabaseMock.removeItemFromWatchlist(itemId);
      const currentItems = get().activeWatchlistItems;
      set({ activeWatchlistItems: currentItems.filter(i => i.id !== itemId) });
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
      get().showToast(`"${item?.title || 'Item'}" removed from vault.`);
    } catch (error) {
      get().showToast('Failed to remove item.', 'error');
    }
  },

  deleteWatchlist: async (id: string) => {
    try {
      const list = get().watchlists.find(w => w.id === id);
      if (list?.is_system_list) return;
      await supabaseMock.deleteWatchlist(id);
      set(state => ({ watchlists: state.watchlists.filter(w => w.id !== id) }));
      get().showToast(`Vault "${list?.title || 'Archive'}" deleted.`);
    } catch (error) {
      get().showToast('Failed to delete vault.', 'error');
    }
  }
}));
