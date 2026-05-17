import { create } from "zustand";
import {
  AppState,
  Watchlist,
  Movie,
  Toast,
} from "../types";
import { authManager } from "../domain/authManager";
import { movieManager } from "../domain/movieManager";
import { watchlistManager } from "../domain/watchlistManager";

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
  createWatchlist: (
    title: string,
    description: string,
  ) => Promise<Watchlist | undefined>;
  addToWatchlist: (watchlistId: string, movie: Movie) => Promise<void>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatchedStatus: (itemId: string) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  fetchWatchlistItems: (watchlistId: string) => Promise<void>;
  showToast: (message: string, type?: Toast["type"], action?: Toast["action"]) => void;
  hideToast: () => void;
  undoDelete: () => void;
}

export const useStore = create<AppState & AppActions>((set, get) => ({
  user: null,
  session: null,
  isInitialLoading: false,
  isNavigating: false,
  isRefreshing: false,
  watchlists: [],
  activeWatchlistItems: [],
  watchlistCache: {},
  favoriteIds: new Set(),
  isLoading: false,
  searchQuery: "",
  searchResults: [],
  trendingMovies: [],
  trendingPage: 1,
  totalTrendingPages: 500,
  searchPage: 1,
  totalSearchPages: 1,
  toast: null,
  pendingDelete: null,

  init: async () => {
    set({ isInitialLoading: true });
    try {
      const data = await authManager.initSession();
      if (data) {
        set({ session: data.session, user: data.user as any });
        await get().loadUserData();
      }
    } catch (error) {
      console.error("Failed to initialize session", error);
    } finally {
      set({ isInitialLoading: false });
    }
  },

  loadUserData: async () => {
    const { watchlists: currentWatchlists, trendingMovies: currentTrending } = get();
    const isFirstLoad = currentWatchlists.length === 0;
    set(isFirstLoad ? { isInitialLoading: true } : { isRefreshing: true });

    try {
      const { watchlists } = await watchlistManager.fetchUserWatchlists();
      
      // Optimization: Parallel fetch but only fetch trending if cache is empty
      const [favData, trendingData] = await Promise.all([
        watchlistManager.fetchFavorites(watchlists),
        currentTrending.length === 0 ? movieManager.getTrendingMovies(1) : Promise.resolve(null)
      ]);

      const newState: any = { watchlists, favoriteIds: favData.favoriteIds };
      if (trendingData) newState.trendingMovies = trendingData.trendingMovies;

      set(newState);
    } finally {
      set({ isInitialLoading: false, isRefreshing: false });
    }
  },

  signInAsGuest: async () => {
    get().showToast("Guest mode not available. Please sign up.", "info");
  },

  signInWithPassword: async (email, password) => {
    try {
      const data = await authManager.signIn(email, password);
      set({ session: data.session, user: data.user as any });
      // Reset cache on login
      set({ watchlistCache: {}, activeWatchlistItems: [] });
      await get().loadUserData();
      get().showToast("Access granted. Welcome back.");
      return true;
    } catch (error: any) {
      get().showToast(error.message, "error");
      return false;
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      const data = await authManager.signUp(email, password);
      set({ session: data.session, user: data.user as any });
      set({ watchlistCache: {}, activeWatchlistItems: [] });
      await get().loadUserData();
      get().showToast("Vault initialized. Welcome.");
      return true;
    } catch (error: any) {
      get().showToast(error.message, "error");
      return false;
    }
  },

  signInWithGoogle: async () => {
    set({ isInitialLoading: true });
    try {
      const data = await authManager.signInWithGoogle();
      set({ session: data.session, user: data.user as any });
      set({ watchlistCache: {}, activeWatchlistItems: [] });
      await get().loadUserData();
      get().showToast("Google Entry Secure. Welcome.");
    } catch (error: any) {
      get().showToast("Google Auth failed.", "error");
    } finally {
      set({ isInitialLoading: false });
    }
  },

  signOut: async () => {
    await authManager.signOut();
    set({ session: null, user: null, watchlists: [], watchlistCache: {}, activeWatchlistItems: [], favoriteIds: new Set() });
    get().showToast("Logged out of the vault.");
  },

  showToast: (message, type = "success", action) => {
    set({ toast: { id: Math.random().toString(36).substring(7), message, type, action } });
  },

  hideToast: () => set({ toast: null }),

  setSearchQuery: async (query) => {
    set({ searchQuery: query, searchPage: 1 });
    if (query.length > 2) {
      set({ isLoading: true });
      const patch = await movieManager.searchMovies(query, 1);
      set({ ...patch, isLoading: false });
    } else {
      set({ searchResults: [] });
    }
  },

  setSearchPage: async (page) => {
    const { searchQuery } = get();
    if (!searchQuery) return;
    set({ isNavigating: true, searchPage: page });
    const patch = await movieManager.searchMovies(searchQuery, page);
    set({ ...patch, isNavigating: false });
  },

  setTrendingPage: async (page) => {
    set({ isNavigating: true, trendingPage: page });
    const patch = await movieManager.getTrendingMovies(page);
    set({ ...patch, isNavigating: false });
  },

  toggleFavorite: async (movie) => {
    const { favoriteIds, watchlists, activeWatchlistItems } = get();
    const favList = watchlists.find(w => w.is_system_list && w.title === "Favorites");
    if (!favList) return;

    const { isFav, newFavoriteIds } = movieManager.calculateFavoriteToggle(movie, favoriteIds);
    set({ favoriteIds: newFavoriteIds });

    try {
      const patch = await watchlistManager.syncFavorite(isFav, movie, favList.id, activeWatchlistItems);
      // Invalidate cache for favorites list
      const newCache = { ...get().watchlistCache };
      delete newCache[favList.id];
      set({ ...patch, watchlistCache: newCache });
      get().showToast(isFav ? "Removed from Favorites." : "Added to Favorites.");
    } catch (error) {
      set({ favoriteIds });
      get().showToast("Failed to update favorites.", "error");
    }
  },

  toggleWatchedStatus: async (itemId) => {
    const previousItems = get().activeWatchlistItems;
    const item = previousItems.find((i) => i.id === itemId);
    if (!item) return;

    const newStatus = !item.is_watched;
    const updatedItems = previousItems.map(i => i.id === itemId ? { ...i, is_watched: newStatus } : i);
    set({ activeWatchlistItems: updatedItems });

    try {
      const { result, watchlists } = await watchlistManager.toggleWatched(itemId);
      if (result !== newStatus) {
        const syncedItems = get().activeWatchlistItems.map(i => i.id === itemId ? { ...i, is_watched: result } : i);
        set({ activeWatchlistItems: syncedItems });
        // Update cache
        const newCache = { ...get().watchlistCache };
        if (item.watchlist_id && newCache[item.watchlist_id]) {
          newCache[item.watchlist_id] = syncedItems;
        }
        set({ watchlistCache: newCache });
      }
      set({ watchlists });
      get().showToast(result ? "Archived in history." : "Returned to watchlist.");
    } catch (error) {
      set({ activeWatchlistItems: previousItems });
      get().showToast("Failed to update status.", "error");
    }
  },

  createWatchlist: async (title, description) => {
    try {
      const { newList } = await watchlistManager.createVault(title, description);
      set((state) => ({ watchlists: [...state.watchlists, newList] }));
      get().showToast(`Vault "${title}" created successfully.`);
      return newList;
    } catch (error) {
      get().showToast("Failed to create vault.", "error");
    }
  },

  addToWatchlist: async (watchlistId, movie) => {
    try {
      const patch = await watchlistManager.addItem(watchlistId, movie);
      // Invalidate cache for target list
      const newCache = { ...get().watchlistCache };
      delete newCache[watchlistId];
      set({ ...patch, watchlistCache: newCache });
      const list = patch.watchlists.find((w: Watchlist) => w.id === watchlistId);
      get().showToast(`"${movie.title}" added to ${list?.title || "vault"}.`);
    } catch (error) {
      get().showToast("Failed to add movie.", "error");
    }
  },

  fetchWatchlistItems: async (watchlistId) => {
    const { watchlistCache } = get();
    if (watchlistCache[watchlistId]) {
      set({ activeWatchlistItems: watchlistCache[watchlistId] });
      return;
    }

    set({ isNavigating: true });
    try {
      const patch = await watchlistManager.fetchItems(watchlistId);
      set({ 
        ...patch, 
        isNavigating: false,
        watchlistCache: { ...watchlistCache, [watchlistId]: patch.activeWatchlistItems }
      });
    } catch (error) {
      set({ isNavigating: false });
    }
  },

  removeFromWatchlist: async (itemId) => {
    const currentItems = get().activeWatchlistItems;
    const item = currentItems.find(i => i.id === itemId);
    if (!item) return;

    const watchlistId = item.watchlist_id;

    // Optimistic removal
    set({ activeWatchlistItems: currentItems.filter(i => i.id !== itemId) });
    set({ pendingDelete: { item, watchlistId, timerId: null as any } });

    get().showToast(`"${item.title}" removed from vault.`, "info", {
      label: "Undo",
      onClick: () => get().undoDelete(),
    });

    const patch = await watchlistManager.removeItemWithDelay(itemId);
    if (patch) {
      if ('error' in patch) {
        set({ activeWatchlistItems: currentItems, pendingDelete: null });
        get().showToast("Failed to remove item.", "error");
      } else {
        // Update cache on successful removal
        const newCache = { ...get().watchlistCache };
        if (watchlistId && newCache[watchlistId]) {
          newCache[watchlistId] = newCache[watchlistId].filter(i => i.id !== itemId);
        }
        set({ ...patch, watchlistCache: newCache });
      }
    }
  },

  undoDelete: () => {
    const { pendingDelete, activeWatchlistItems, watchlistCache } = get();
    if (!pendingDelete) return;

    if (watchlistManager.cancelRemoval(pendingDelete.item.id)) {
      const restoredItems = [...activeWatchlistItems, pendingDelete.item];
      
      // Update cache
      const newCache = { ...watchlistCache };
      if (pendingDelete.watchlistId && newCache[pendingDelete.watchlistId]) {
        newCache[pendingDelete.watchlistId] = [...newCache[pendingDelete.watchlistId], pendingDelete.item];
      }

      set({
        activeWatchlistItems: restoredItems,
        watchlistCache: newCache,
        pendingDelete: null,
        toast: null,
      });
      get().showToast(`"${pendingDelete.item.title}" restored.`);
    }
  },

  deleteWatchlist: async (id) => {
    try {
      const patch = await watchlistManager.deleteVault(id, get().watchlists);
      const newCache = { ...get().watchlistCache };
      delete newCache[id];
      set({ ...patch, watchlistCache: newCache });
      get().showToast("Vault deleted.");
    } catch (error: any) {
      get().showToast(error.message || "Failed to delete vault.", "error");
    }
  },
}));

export default useStore;
