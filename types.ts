
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

export interface AppState {
  user: Profile | null;
  watchlists: Watchlist[];
  activeWatchlistItems: WatchlistItem[];
  isLoading: boolean;
  searchQuery: string;
  searchResults: Movie[];
  trendingMovies: Movie[];
}
