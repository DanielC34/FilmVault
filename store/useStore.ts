
import { create } from 'zustand';
import { AppState, Profile, Watchlist, WatchlistItem, Movie } from '../types';
import { supabaseMock } from '../services/supabaseMock';
import { tmdbService } from '../services/tmdbService';

interface AppActions {
  init: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  loadMoreSearch: () => Promise<void>;
  fetchTrending: (page?: number) => Promise<void>;
  loadMoreTrending: () => Promise<void>;
  createWatchlist: (title: string, description: string) => Promise<Watchlist | undefined>;
  addToWatchlist: (watchlistId: string, movie: Movie) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  fetchWatchlistItems: (watchlistId: string) => Promise<void>;
}

interface ExtendedAppState extends AppState {
  trendingPage: number;
  searchPage: number;
  isMoreLoading: boolean;
}

export const useStore = create<ExtendedAppState & AppActions>((set, get) => ({
  user: null,
  watchlists: [],
  activeWatchlistItems: [],
  isLoading: false,
  isMoreLoading: false,
  searchQuery: '',
  searchResults: [],
  trendingMovies: [],
  trendingPage: 1,
  searchPage: 1,

  init: async () => {
    set({ isLoading: true });
    try {
      const user = await supabaseMock.getProfile();
      const watchlists = await supabaseMock.getWatchlists();
      const trending = await tmdbService.getTrending(1);
      set({ user, watchlists, trendingMovies: trending, trendingPage: 1, isLoading: false });
    } catch (error) {
      console.error('Initialization Error:', error);
      set({ isLoading: false });
    }
  },

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

  loadMoreSearch: async () => {
    const { searchQuery, searchPage, searchResults, isMoreLoading } = get();
    if (isMoreLoading || !searchQuery) return;

    set({ isMoreLoading: true });
    try {
      const nextPage = searchPage + 1;
      const results = await tmdbService.search(searchQuery, nextPage);
      set({ 
        searchResults: [...searchResults, ...results], 
        searchPage: nextPage,
        isMoreLoading: false 
      });
    } catch (error) {
      set({ isMoreLoading: false });
    }
  },

  fetchTrending: async (page: number = 1) => {
    try {
      const trending = await tmdbService.getTrending(page);
      if (page === 1) {
        set({ trendingMovies: trending, trendingPage: 1 });
      } else {
        set(state => ({ 
          trendingMovies: [...state.trendingMovies, ...trending], 
          trendingPage: page 
        }));
      }
    } catch (error) {
      console.error('Fetch Trending Error:', error);
    }
  },

  loadMoreTrending: async () => {
    const { trendingPage, isMoreLoading } = get();
    if (isMoreLoading) return;

    set({ isMoreLoading: true });
    try {
      const nextPage = trendingPage + 1;
      const trending = await tmdbService.getTrending(nextPage);
      set(state => ({ 
        trendingMovies: [...state.trendingMovies, ...trending], 
        trendingPage: nextPage,
        isMoreLoading: false 
      }));
    } catch (error) {
      set({ isMoreLoading: false });
    }
  },

  createWatchlist: async (title: string, description: string) => {
    try {
      const newList = await supabaseMock.createWatchlist(title, description);
      set(state => ({ watchlists: [...state.watchlists, newList] }));
      return newList;
    } catch (error) {
      console.error('Create Watchlist Error:', error);
      return undefined;
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
