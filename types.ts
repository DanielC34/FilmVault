
export type MediaType = 'movie' | 'tv';

export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  media_type: MediaType;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface Watchlist {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  item_count?: number;
  is_system_list?: boolean;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  media_id: string;
  media_type: MediaType;
  title: string;
  poster_path: string;
  added_at: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppState {
  user: Profile | null;
  watchlists: Watchlist[];
  activeWatchlistItems: WatchlistItem[];
  favoriteIds: Set<string>; // For quick lookup of favorited movies
  isLoading: boolean;
  searchQuery: string;
  searchResults: Movie[];
  trendingMovies: Movie[];
  toast: Toast | null;
  trendingPage: number;
  totalTrendingPages: number;
  searchPage: number;
  totalSearchPages: number;
}
