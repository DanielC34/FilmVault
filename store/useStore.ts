
import { create } from 'zustand';
import { AppState, Profile, Watchlist, WatchlistItem, Movie } from '../types';
import { supabaseMock } from '../services/supabaseMock';
import { tmdbService } from '../services/tmdbService';

interface AppActions {
  init: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  fetchTrending: () => Promise<void>;
  createWatchlist: (title: string, description: string) => Promise<void>;
  addToWatchlist: (watchlistId: string, movie: Movie) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  fetchWatchlistItems: (watchlistId: string) => Promise<void>;
}

export const useStore = create<AppState & AppActions>((set, get) => ({
  user: null,
  watchlists: [],
  activeWatchlistItems: [],
  isLoading: false,
  searchQuery: '',
  searchResults: [],
  trendingMovies: [],

  init: async () => {
    set({ isLoading: true });
    try {
      const user = await supabaseMock.getProfile();
      const watchlists = await supabaseMock.getWatchlists();
      const trending = await tmdbService.getTrending();
      set({ user, watchlists, trendingMovies: trending, isLoading: false });
    } catch (error) {
      console.error('Initialization Error:', error);
      set({ isLoading: false });
    }
  },

  setSearchQuery: async (query: string) => {
    set({ searchQuery: query });
    if (query.length > 2) {
      try {
        const results = await tmdbService.search(query);
        set({ searchResults: results });
      } catch (error) {
        set({ searchResults: [] });
      }
    } else {
      set({ searchResults: [] });
    }
  },

  fetchTrending: async () => {
    try {
      const trending = await tmdbService.getTrending();
      set({ trendingMovies: trending });
    } catch (error) {
      console.error('Fetch Trending Error:', error);
    }
  },

  createWatchlist: async (title: string, description: string) => {
    try {
      const newList = await supabaseMock.createWatchlist(title, description);
      set(state => ({ watchlists: [...state.watchlists, newList] }));
    } catch (error) {
      console.error('Create Watchlist Error:', error);
    }
  },

  addToWatchlist: async (watchlistId: string, movie: Movie) => {
    try {
      await supabaseMock.addItemToWatchlist(watchlistId, movie);
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
    } catch (error) {
      console.error('Add To Watchlist Error:', error);
    }
  },

  fetchWatchlistItems: async (watchlistId: string) => {
    set({ isLoading: true });
    try {
      const items = await supabaseMock.getWatchlistItems(watchlistId);
      set({ activeWatchlistItems: items, isLoading: false });
    } catch (error) {
      console.error('Fetch Watchlist Items Error:', error);
      set({ isLoading: false });
    }
  },

  removeFromWatchlist: async (itemId: string) => {
    try {
      await supabaseMock.removeItemFromWatchlist(itemId);
      const currentItems = get().activeWatchlistItems;
      set({ activeWatchlistItems: currentItems.filter(i => i.id !== itemId) });
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
    } catch (error) {
      console.error('Remove From Watchlist Error:', error);
    }
  },

  deleteWatchlist: async (id: string) => {
    try {
      await supabaseMock.deleteWatchlist(id);
      set(state => ({ watchlists: state.watchlists.filter(w => w.id !== id) }));
    } catch (error) {
      console.error('Delete Watchlist Error:', error);
    }
  }
}));
