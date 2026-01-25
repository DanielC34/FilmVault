
import { Watchlist, WatchlistItem, Profile, MediaType } from '../types';

const MOCK_USER: Profile = {
  id: 'user_123',
  username: 'cinephile_99',
  avatar_url: 'https://picsum.photos/id/64/200/200',
};

let mockWatchlists: Watchlist[] = [
  {
    id: 'wl_fav',
    user_id: 'user_123',
    title: 'Favorites',
    description: 'Your top-tier cinematic picks.',
    created_at: new Date().toISOString(),
    item_count: 0,
    is_system_list: true
  },
  {
    id: 'wl_1',
    user_id: 'user_123',
    title: '2025 Must Watch',
    description: 'The definitive list for next year.',
    created_at: new Date().toISOString(),
    item_count: 1
  }
];

let mockItems: WatchlistItem[] = [
  {
    id: 'item_1',
    watchlist_id: 'wl_1',
    media_id: '550',
    media_type: 'movie',
    title: 'Fight Club',
    poster_path: '/pB8BjbpvovmBwi0pSHExrS9eZ3n.jpg',
    added_at: new Date().toISOString()
  }
];

export const supabaseMock = {
  getProfile: async () => MOCK_USER,
  
  getWatchlists: async () => {
    return [...mockWatchlists];
  },

  getFavorites: async () => {
    const favList = mockWatchlists.find(w => w.is_system_list);
    if (!favList) return [];
    return mockItems.filter(i => i.watchlist_id === favList.id);
  },

  createWatchlist: async (title: string, description: string) => {
    const newList: Watchlist = {
      id: `wl_${Math.random().toString(36).substr(2, 9)}`,
      user_id: MOCK_USER.id,
      title,
      description,
      created_at: new Date().toISOString(),
      item_count: 0,
      is_system_list: false
    };
    mockWatchlists.push(newList);
    return newList;
  },

  deleteWatchlist: async (id: string) => {
    const list = mockWatchlists.find(w => w.id === id);
    if (list?.is_system_list) throw new Error("Cannot delete system list");
    mockWatchlists = mockWatchlists.filter(w => w.id !== id);
    mockItems = mockItems.filter(i => i.watchlist_id !== id);
    return true;
  },

  getWatchlistItems: async (watchlistId: string) => {
    return mockItems.filter(item => item.watchlist_id === watchlistId);
  },

  addItemToWatchlist: async (watchlistId: string, movie: any) => {
    // Check if already in this specific list
    const exists = mockItems.find(i => i.watchlist_id === watchlistId && i.media_id === String(movie.id));
    if (exists) return exists;

    const newItem: WatchlistItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      watchlist_id: watchlistId,
      media_id: String(movie.id),
      media_type: movie.media_type || 'movie',
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      added_at: new Date().toISOString()
    };
    mockItems.push(newItem);
    
    const list = mockWatchlists.find(w => w.id === watchlistId);
    if (list) list.item_count = (list.item_count || 0) + 1;
    
    return newItem;
  },

  removeItemFromWatchlist: async (itemId: string) => {
    const item = mockItems.find(i => i.id === itemId);
    if (item) {
      const list = mockWatchlists.find(w => w.id === item.watchlist_id);
      if (list && list.item_count) list.item_count -= 1;
    }
    mockItems = mockItems.filter(i => i.id !== itemId);
    return true;
  },

  removeMovieFromWatchlist: async (watchlistId: string, mediaId: string) => {
    const item = mockItems.find(i => i.watchlist_id === watchlistId && i.media_id === mediaId);
    if (item) {
      const list = mockWatchlists.find(w => w.id === watchlistId);
      if (list && list.item_count) list.item_count -= 1;
      mockItems = mockItems.filter(i => i.id !== item.id);
    }
    return true;
  }
};
