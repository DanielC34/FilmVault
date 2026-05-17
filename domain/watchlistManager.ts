
import { mongoService } from '../services/mongoService';
import { Watchlist, Movie, WatchlistItem } from '../types';

let pendingRemovals = new Map<string, { timerId: NodeJS.Timeout, resolve: (val: any) => void }>();

export const watchlistManager = {
  async fetchUserWatchlists() {
    const watchlists = await mongoService.getWatchlists();
    return { watchlists };
  },

  async fetchFavorites(watchlists: Watchlist[]) {
    const favList = watchlists.find(
      (w) => w.is_system_list && w.title === "Favorites"
    );
    if (!favList) return { favoriteIds: new Set<string>() };
    
    const items = await mongoService.getWatchlistItems(favList.id);
    return { favoriteIds: new Set(items.map((i: WatchlistItem) => i.media_id)) };
  },

  async createVault(title: string, description: string) {
    const newList = await mongoService.createWatchlist(title, description);
    return { newList };
  },

  async deleteVault(id: string, currentWatchlists: Watchlist[]) {
    const list = currentWatchlists.find((w) => w.id === id);
    if (list?.is_system_list) {
      throw new Error("System vaults cannot be deleted.");
    }
    await mongoService.deleteWatchlist(id);
    const watchlists = currentWatchlists.filter((w) => w.id !== id);
    return { watchlists };
  },

  async fetchItems(watchlistId: string) {
    const items = await mongoService.getWatchlistItems(watchlistId);
    return { activeWatchlistItems: items };
  },

  async addItem(watchlistId: string, movie: Movie) {
    await mongoService.addItemToWatchlist(watchlistId, movie);
    const watchlists = await mongoService.getWatchlists();
    return { watchlists };
  },

  async toggleWatched(itemId: string) {
    const result = await mongoService.toggleWatchedStatus(itemId);
    const watchlists = await mongoService.getWatchlists();
    return { result, watchlists };
  },

  // Returns a promise that resolves after 6 seconds with the final state
  async removeItemWithDelay(itemId: string): Promise<{ watchlists: Watchlist[], pendingDelete: null } | { error: any, pendingDelete: null }> {
    return new Promise<{ watchlists: Watchlist[], pendingDelete: null } | { error: any, pendingDelete: null }>((resolve) => {
      const timerId = setTimeout(async () => {
        try {
          await mongoService.removeItemFromWatchlist(itemId);
          const watchlists = await mongoService.getWatchlists();
          pendingRemovals.delete(itemId);
          resolve({ watchlists, pendingDelete: null });
        } catch (e) {
          resolve({ error: e, pendingDelete: null });
        }
      }, 6000);

      pendingRemovals.set(itemId, { timerId, resolve });
    });
  },

  cancelRemoval(itemId: string) {
    const pending = pendingRemovals.get(itemId);
    if (pending) {
      clearTimeout(pending.timerId);
      pendingRemovals.delete(itemId);
      return true;
    }
    return false;
  },

  async syncFavorite(isFav: boolean, movie: Movie, favListId: string, activeItems: WatchlistItem[]) {
    if (isFav) {
      const item = activeItems.find(
        (i) => i.media_id === String(movie.id) && i.watchlist_id === favListId,
      );
      if (item) await mongoService.removeItemFromWatchlist(item.id);
    } else {
      await mongoService.addItemToWatchlist(favListId, movie);
    }
    const watchlists = await mongoService.getWatchlists();
    return { watchlists };
  }
};
