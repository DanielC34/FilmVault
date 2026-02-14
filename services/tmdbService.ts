
import { Movie, MediaType } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'f08f416251b2a32f3116e9be8cdd306a';
const BASE_URL = 'https://api.themoviedb.org/3';

const normalizeResult = (item: any): Movie => ({
  id: String(item.id),
  title: item.title || item.name || 'Unknown Title',
  overview: item.overview || '',
  poster_path: item.poster_path || '',
  backdrop_path: item.backdrop_path || '',
  release_date: item.release_date || item.first_air_date || '',
  vote_average: item.vote_average || 0,
  media_type: item.media_type || (item.title ? 'movie' : 'tv'),
  genres: item.genres?.map((g: any) => g.name) || [],
  runtime: item.runtime || item.episode_run_time?.[0] || undefined,
});

export const tmdbService = {
  getTrending: async (page: number = 1): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/all/day?api_key=${API_KEY}&page=${page}`
      );
      if (!response.ok) throw new Error('Failed to fetch trending');
      const data = await response.json();
      return data.results
        .filter((item: any) => item.media_type !== 'person')
        .map(normalizeResult);
    } catch (error) {
      console.error('TMDB Trending Error:', error);
      return [];
    }
  },

  search: async (query: string, page: number = 1): Promise<Movie[]> => {
    if (!query) return [];
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.results
        .filter((item: any) => item.media_type !== 'person' && (item.poster_path || item.backdrop_path))
        .map(normalizeResult);
    } catch (error) {
      console.error('TMDB Search Error:', error);
      return [];
    }
  },

  getDetails: async (id: string, type: MediaType): Promise<Movie | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
      );
      if (!response.ok) throw new Error('Details fetch failed');
      const data = await response.json();
      return normalizeResult({ ...data, media_type: type });
    } catch (error) {
      console.error('TMDB Details Error:', error);
      return null;
    }
  }
};
