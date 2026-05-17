
import { tmdbService } from '../services/tmdbService';
import { Movie, Watchlist, WatchlistItem } from '../types';

export const movieManager = {
  async searchMovies(query: string, page: number) {
    if (query.length <= 2) return { searchResults: [] };
    const results = await tmdbService.search(query, page);
    return { searchResults: results };
  },

  async getTrendingMovies(page: number) {
    const results = await tmdbService.getTrending(page);
    return { trendingMovies: results };
  },

  calculateFavoriteToggle(movie: Movie, currentFavoriteIds: Set<string>) {
    const isFav = currentFavoriteIds.has(String(movie.id));
    const newFavoriteIds = new Set(currentFavoriteIds);
    if (isFav) {
      newFavoriteIds.delete(String(movie.id));
    } else {
      newFavoriteIds.add(String(movie.id));
    }
    return { isFav, newFavoriteIds };
  }
};
