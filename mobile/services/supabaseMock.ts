import AsyncStorage from "@react-native-async-storage/async-storage";
import { Watchlist, WatchlistItem, Profile, MediaType } from "../types";

const STORAGE_KEY = "fv_mock_users";
const WATCHLISTS_KEY = "fv_mock_watchlists";
const ITEMS_KEY = "fv_mock_items";

const getMockUsers = async (): Promise<Profile[]> => {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  return saved
    ? JSON.parse(saved)
    : [
        {
          id: "user_123",
          username: "cinephile_99",
          avatar_url: "https://picsum.photos/id/64/200/200",
        },
      ];
};

const saveMockUsers = async (users: Profile[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const getMockWatchlists = async (): Promise<Watchlist[]> => {
  const saved = await AsyncStorage.getItem(WATCHLISTS_KEY);
  if (saved) return JSON.parse(saved);

  const defaults = [
    {
      id: "wl_fav",
      user_id: "user_123",
      title: "Favorites",
      description: "Your top-tier cinematic picks.",
      created_at: new Date().toISOString(),
      item_count: 0,
      is_system_list: true,
    },
    {
      id: "wl_1",
      user_id: "user_123",
      title: "2025 Must Watch",
      description: "The definitive list for next year.",
      created_at: new Date().toISOString(),
      item_count: 1,
    },
  ];
  await AsyncStorage.setItem(WATCHLISTS_KEY, JSON.stringify(defaults));
  return defaults;
};

const saveMockWatchlists = async (lists: Watchlist[]) => {
  await AsyncStorage.setItem(WATCHLISTS_KEY, JSON.stringify(lists));
};

const getMockItems = async (): Promise<WatchlistItem[]> => {
  const saved = await AsyncStorage.getItem(ITEMS_KEY);
  if (saved) return JSON.parse(saved);

  const defaults = [
    {
      id: "item_1",
      watchlist_id: "wl_1",
      media_id: "550",
      media_type: "movie",
      title: "Fight Club",
      poster_path: "/pB8BjbpvovmBwi0pSHExrS9eZ3n.jpg",
      added_at: new Date().toISOString(),
      is_watched: false,
    },
  ];
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(defaults));
  return defaults;
};

const saveMockItems = async (items: WatchlistItem[]) => {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
};

export const supabaseMock = {
  getProfile: async (userId?: string) => {
    const users = await getMockUsers();
    return users.find((u) => u.id === userId) || users[0];
  },

  register: async (email: string) => {
    const users = await getMockUsers();
    const username = email.split("@")[0];
    const newUser: Profile = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      username: username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };
    users.push(newUser);
    await saveMockUsers(users);
    return newUser;
  },

  getWatchlists: async () => {
    return await getMockWatchlists();
  },

  getFavorites: async () => {
    const lists = await getMockWatchlists();
    const items = await getMockItems();
    const favList = lists.find((w) => w.is_system_list);
    if (!favList) return [];
    return items.filter((i) => i.watchlist_id === favList.id);
  },

  createWatchlist: async (title: string, description: string) => {
    const users = await getMockUsers();
    const lists = await getMockWatchlists();

    const newList: Watchlist = {
      id: `wl_${Math.random().toString(36).substr(2, 9)}`,
      user_id: users[0].id,
      title,
      description,
      created_at: new Date().toISOString(),
      item_count: 0,
      is_system_list: title === "Already Watched",
    };
    lists.push(newList);
    await saveMockWatchlists(lists);
    return newList;
  },

  deleteWatchlist: async (id: string) => {
    const lists = await getMockWatchlists();
    const items = await getMockItems();

    const list = lists.find((w) => w.id === id);
    if (list?.is_system_list) throw new Error("Cannot delete system list");

    const updated = lists.filter((w) => w.id !== id);
    const updatedItems = items.filter((i) => i.watchlist_id !== id);

    await saveMockWatchlists(updated);
    await saveMockItems(updatedItems);
    return true;
  },

  getWatchlistItems: async (watchlistId: string) => {
    const items = await getMockItems();
    return items.filter((item) => item.watchlist_id === watchlistId);
  },

  addItemToWatchlist: async (watchlistId: string, movie: any) => {
    const items = await getMockItems();
    const lists = await getMockWatchlists();

    const exists = items.find(
      (i) => i.watchlist_id === watchlistId && i.media_id === String(movie.id)
    );
    if (exists) return exists;

    const newItem: WatchlistItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      watchlist_id: watchlistId,
      media_id: String(movie.id),
      media_type: movie.media_type || "movie",
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      added_at: new Date().toISOString(),
      is_watched: false,
    };
    items.push(newItem);

    const list = lists.find((w) => w.id === watchlistId);
    if (list) list.item_count = (list.item_count || 0) + 1;

    await saveMockItems(items);
    await saveMockWatchlists(lists);
    return newItem;
  },

  removeItemFromWatchlist: async (itemId: string) => {
    const items = await getMockItems();
    const lists = await getMockWatchlists();

    const item = items.find((i) => i.id === itemId);
    if (item) {
      const list = lists.find((w) => w.id === item.watchlist_id);
      if (list && list.item_count) list.item_count -= 1;
    }

    const updated = items.filter((i) => i.id !== itemId);
    await saveMockItems(updated);
    await saveMockWatchlists(lists);
    return true;
  },

  removeMovieFromWatchlist: async (watchlistId: string, mediaId: string) => {
    const items = await getMockItems();
    const lists = await getMockWatchlists();

    const item = items.find(
      (i) => i.watchlist_id === watchlistId && i.media_id === mediaId
    );
    if (item) {
      const list = lists.find((w) => w.id === watchlistId);
      if (list && list.item_count) list.item_count -= 1;
      const updated = items.filter((i) => i.id !== item.id);
      await saveMockItems(updated);
      await saveMockWatchlists(lists);
    }
    return true;
  },

  toggleWatchedStatus: async (itemId: string) => {
    const items = await getMockItems();
    const lists = await getMockWatchlists();

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    item.is_watched = !item.is_watched;

    if (item.is_watched) {
      let watchedList = lists.find((w) => w.title === "Already Watched");
      if (!watchedList) {
        watchedList = {
          id: "wl_watched",
          user_id: item.watchlist_id,
          title: "Already Watched",
          description: "A complete record of your cinematic journey.",
          created_at: new Date().toISOString(),
          item_count: 0,
          is_system_list: true,
        };
        lists.push(watchedList);
      }

      const alreadyInHistory = items.find(
        (i) =>
          i.watchlist_id === watchedList!.id && i.media_id === item.media_id
      );
      if (!alreadyInHistory) {
        const historyItem: WatchlistItem = {
          ...item,
          id: `item_hist_${Math.random().toString(36).substr(2, 9)}`,
          watchlist_id: watchedList!.id,
          added_at: new Date().toISOString(),
          is_watched: true,
        };
        items.push(historyItem);
        watchedList.item_count = (watchedList.item_count || 0) + 1;
      }
    }

    await saveMockItems(items);
    await saveMockWatchlists(lists);
    return item.is_watched;
  },
};
