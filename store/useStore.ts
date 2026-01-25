
import { create } from 'zustand';
import { AppState, Profile, Watchlist, WatchlistItem, Movie, Toast } from '../types';
import { supabaseMock } from '../services/supabaseMock';
import { tmdbService } from '../services/tmdbService';

interface AppActions {
  init: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchPage: (page: number) => Promise<void>;
  setTrendingPage: (page: number) => Promise<void>;
  createWatchlist: (title: string, description: string) => Promise<Watchlist | undefined>;
  addToWatchlist: (watchlistId: string, movie: Movie) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  fetchWatchlistItems: (watchlistId: string) => Promise<void>;
  showToast: (message: string, type?: Toast['type']) => void;
  hideToast: () => void;
}

export const useStore = create<AppState & AppActions>((set, get) => ({
  user: null,
  watchlists: [],
  activeWatchlistItems: [],
  isLoading: false,
  searchQuery: '',
  searchResults: [],
  trendingMovies: [],
  trendingPage: 1,
  totalTrendingPages: 1,
  searchPage: 1,
  totalSearchPages: 1,
  toast: null,

  init: async () => {
    set({ isLoading: true });
    try {
      const user = await supabaseMock.getProfile();
      const watchlists = await supabaseMock.getWatchlists();
      
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=f08f416251b2a32f3116e9be8cdd306a&page=1`
      );
      const data = await response.json();
      const trending = data.results
        .filter((item: any) => item.media_type !== 'person')
        .map((item: any) => ({
          id: String(item.id),
          title: item.title || item.name || 'Unknown Title',
          overview: item.overview || '',
          poster_path: item.poster_path || '',
          backdrop_path: item.backdrop_path || '',
          release_date: item.release_date || item.first_air_date || '',
          vote_average: item.vote_average || 0,
          media_type: item.media_type || (item.title ? 'movie' : 'tv'),
        }));

      set({ 
        user, 
        watchlists, 
        trendingMovies: trending, 
        trendingPage: 1, 
        totalTrendingPages: Math.min(data.total_pages, 500), // TMDB caps at 500
        isLoading: false 
      });
    } catch (error) {
      console.error('Initialization Error:', error);
      set({ isLoading: false });
    }
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
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=f08f416251b2a32f3116e9be8cdd306a&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        const results = data.results
          .filter((item: any) => item.media_type !== 'person' && (item.poster_path || item.backdrop_path))
          .map((item: any) => ({
            id: String(item.id),
            title: item.title || item.name || 'Unknown Title',
            overview: item.overview || '',
            poster_path: item.poster_path || '',
            backdrop_path: item.backdrop_path || '',
            release_date: item.release_date || item.first_air_date || '',
            vote_average: item.vote_average || 0,
            media_type: item.media_type || (item.title ? 'movie' : 'tv'),
          }));
        set({ 
          searchResults: results, 
          totalSearchPages: data.total_pages,
          isLoading: false 
        });
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
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=f08f416251b2a32f3116e9be8cdd306a&query=${encodeURIComponent(searchQuery)}&page=${page}`
      );
      const data = await response.json();
      const results = data.results
        .filter((item: any) => item.media_type !== 'person' && (item.poster_path || item.backdrop_path))
        .map((item: any) => ({
          id: String(item.id),
          title: item.title || item.name || 'Unknown Title',
          overview: item.overview || '',
          poster_path: item.poster_path || '',
          backdrop_path: item.backdrop_path || '',
          release_date: item.release_date || item.first_air_date || '',
          vote_average: item.vote_average || 0,
          media_type: item.media_type || (item.title ? 'movie' : 'tv'),
        }));
      set({ searchResults: results, isLoading: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setTrendingPage: async (page: number) => {
    set({ isLoading: true, trendingPage: page });
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=f08f416251b2a32f3116e9be8cdd306a&page=${page}`
      );
      const data = await response.json();
      const trending = data.results
        .filter((item: any) => item.media_type !== 'person')
        .map((item: any) => ({
          id: String(item.id),
          title: item.title || item.name || 'Unknown Title',
          overview: item.overview || '',
          poster_path: item.poster_path || '',
          backdrop_path: item.backdrop_path || '',
          release_date: item.release_date || item.first_air_date || '',
          vote_average: item.vote_average || 0,
          media_type: item.media_type || (item.title ? 'movie' : 'tv'),
        }));
      set({ trendingMovies: trending, isLoading: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createWatchlist: async (title: string, description: string) => {
    try {
      const newList = await supabaseMock.createWatchlist(title, description);
      set(state => ({ watchlists: [...state.watchlists, newList] }));
      get().showToast(`Vault "${title}" created successfully.`);
      return newList;
    } catch (error) {
      console.error('Create Watchlist Error:', error);
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
      console.error('Add To Watchlist Error:', error);
      get().showToast('Failed to add movie.', 'error');
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
      const item = get().activeWatchlistItems.find(i => i.id === itemId);
      await supabaseMock.removeItemFromWatchlist(itemId);
      const currentItems = get().activeWatchlistItems;
      set({ activeWatchlistItems: currentItems.filter(i => i.id !== itemId) });
      const watchlists = await supabaseMock.getWatchlists();
      set({ watchlists });
      get().showToast(`"${item?.title || 'Item'}" removed from vault.`);
    } catch (error) {
      console.error('Remove From Watchlist Error:', error);
      get().showToast('Failed to remove item.', 'error');
    }
  },

  deleteWatchlist: async (id: string) => {
    try {
      const list = get().watchlists.find(w => w.id === id);
      await supabaseMock.deleteWatchlist(id);
      set(state => ({ watchlists: state.watchlists.filter(w => w.id !== id) }));
      get().showToast(`Vault "${list?.title || 'Archive'}" deleted.`);
    } catch (error) {
      console.error('Delete Watchlist Error:', error);
      get().showToast('Failed to delete vault.', 'error');
    }
  }
}));
