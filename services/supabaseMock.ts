

import { Watchlist, WatchlistItem, Profile, MediaType } from '../types';

// In a real app, this would use the @supabase/supabase-js client.
// Here we simulate the logic for the SPA environment.

const MOCK_USER: Profile = {
  id: 'user_123',
  username: 'cinephile_99',
  avatar_url: 'https://picsum.photos/id/64/200/200',
};

let mockWatchlists: Watchlist[] = [
  {
    id: 'wl_1',
    user_id: 'user_123',
    title: '2025 Must Watch',
    description: 'The definitive list for next year.',
    created_at: new Date().toISOString(),
    item_count: 3
  },
  {
    id: 'wl_2',
    user_id: 'user_123',
    title: 'Horror Classics',
    description: 'Spooky season essentials.',
    created_at: new Date().toISOString(),
    item_count: 1
  }
];

let mockItems: WatchlistItem[] = [
  {
    id: 'item_1',
    watchlist_id: 'wl_1',
    // Fixed: Converting numeric value to string as per WatchlistItem interface
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

  createWatchlist: async (title: string, description: string) => {
    const newList: Watchlist = {
      id: `wl_${Math.random().toString(36).substr(2, 9)}`,
      user_id: MOCK_USER.id,
      title,
      description,
      created_at: new Date().toISOString(),
      item_count: 0
    };
    mockWatchlists.push(newList);
    return newList;
  },

  deleteWatchlist: async (id: string) => {
    mockWatchlists = mockWatchlists.filter(w => w.id !== id);
    mockItems = mockItems.filter(i => i.watchlist_id !== id);
    return true;
  },

  getWatchlistItems: async (watchlistId: string) => {
    return mockItems.filter(item => item.watchlist_id === watchlistId);
  },

  addItemToWatchlist: async (watchlistId: string, movie: any) => {
    const newItem: WatchlistItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      watchlist_id: watchlistId,
      // Fixed: Ensuring media_id is always stored as a string
      media_id: String(movie.id),
      media_type: movie.media_type || 'movie',
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      added_at: new Date().toISOString()
    };
    mockItems.push(newItem);
    
    // Update count
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
  }
};
