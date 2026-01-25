
import { Watchlist, WatchlistItem, Profile, MediaType } from '../types';

const STORAGE_KEY = 'fv_mock_users';

const getMockUsers = (): Profile[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [{
    id: 'user_123',
    username: 'cinephile_99',
    avatar_url: 'https://picsum.photos/id/64/200/200',
  }];
};

const saveMockUsers = (users: Profile[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
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
    added_at: new Date().toISOString(),
    is_watched: false
  }
];

export const supabaseMock = {
  getProfile: async (userId?: string) => {
    const users = getMockUsers();
    return users.find(u => u.id === userId) || users[0];
  },

  register: async (email: string) => {
    const users = getMockUsers();
    const username = email.split('@')[0];
    const newUser: Profile = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      username: username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };
    users.push(newUser);
    saveMockUsers(users);
    return newUser;
  },
  
  getWatchlists: async () => {
    return [...mockWatchlists];
  },

  getFavorites: async () => {
    const favList = mockWatchlists.find(w => w.is_system_list);
    if (!favList) return [];
    return mockItems.filter(i => i.watchlist_id === favList.id);
  },

  createWatchlist: async (title: string, description: string) => {
    const users = getMockUsers();
    const newList: Watchlist = {
      id: `wl_${Math.random().toString(36).substr(2, 9)}`,
      user_id: users[0].id,
      title,
      description,
      created_at: new Date().toISOString(),
      item_count: 0,
      is_system_list: title === 'Already Watched'
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
    const exists = mockItems.find(i => i.watchlist_id === watchlistId && i.media_id === String(movie.id));
    if (exists) return exists;

    const newItem: WatchlistItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      watchlist_id: watchlistId,
      media_id: String(movie.id),
      media_type: movie.media_type || 'movie',
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      added_at: new Date().toISOString(),
      is_watched: false
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
  },

  toggleWatchedStatus: async (itemId: string) => {
    const item = mockItems.find(i => i.id === itemId);
    if (!item) return;

    item.is_watched = !item.is_watched;

    if (item.is_watched) {
      // Ensure "Already Watched" list exists
      let watchedList = mockWatchlists.find(w => w.title === 'Already Watched');
      if (!watchedList) {
        watchedList = {
          id: 'wl_watched',
          user_id: item.watchlist_id, // approximation
          title: 'Already Watched',
          description: 'A complete record of your cinematic journey.',
          created_at: new Date().toISOString(),
          item_count: 0,
          is_system_list: true
        };
        mockWatchlists.push(watchedList);
      }

      // Add to "Already Watched" if not present
      const alreadyInHistory = mockItems.find(i => i.watchlist_id === watchedList!.id && i.media_id === item.media_id);
      if (!alreadyInHistory) {
        const historyItem: WatchlistItem = {
          ...item,
          id: `item_hist_${Math.random().toString(36).substr(2, 9)}`,
          watchlist_id: watchedList!.id,
          added_at: new Date().toISOString(),
          is_watched: true
        };
        mockItems.push(historyItem);
        watchedList.item_count = (watchedList.item_count || 0) + 1;
      }
    }

    return item.is_watched;
  }
};
