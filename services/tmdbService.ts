
import { Movie } from '../types';

const OMDB_API_KEY = '9d7df543';
const BASE_URL = 'https://www.omdbapi.com/';

const normalizeResult = (item: any): Movie => ({
  id: item.imdbID,
  title: item.Title || 'Unknown Title',
  overview: item.Plot || '',
  poster_path: item.Poster !== 'N/A' ? item.Poster : '',
  backdrop_path: item.Poster !== 'N/A' ? item.Poster : '', // OMDB doesn't provide backdrops easily
  release_date: item.Released || item.Year || '',
  vote_average: item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0,
  media_type: item.Type === 'series' ? 'tv' : 'movie',
});

export const tmdbService = {
  getTrending: async (): Promise<Movie[]> => {
    try {
      // OMDB doesn't have a "trending" endpoint. 
      // We'll simulate it by searching for some currently popular keywords.
      const keywords = ['Marvel', 'Batman', 'Star Wars', 'Stranger Things'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&s=${randomKeyword}&type=movie`);
      if (!response.ok) throw new Error('Failed to fetch simulated trending');
      
      const data = await response.json();
      if (data.Response === 'False') return [];

      // Fetch details for the first few to get Plot and Rating
      const detailedResults = await Promise.all(
        data.Search.slice(0, 8).map(async (item: any) => {
          const detailRes = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${item.imdbID}`);
          return detailRes.json();
        })
      );

      return detailedResults.map(normalizeResult);
    } catch (error) {
      console.error('OMDB Error (Trending Simulation):', error);
      return [];
    }
  },

  search: async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    try {
      const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      if (data.Response === 'False') return [];

      // For search results, we often just get Title, Year, imdbID, Type, Poster.
      // We return them normalized. Note: Overview will be empty until details are fetched.
      return data.Search.map((item: any) => normalizeResult(item));
    } catch (error) {
      console.error('OMDB Search Error:', error);
      return [];
    }
  },

  getDetails: async (id: string): Promise<Movie | null> => {
    try {
      const response = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
      if (!response.ok) throw new Error('Details fetch failed');
      const data = await response.json();
      
      if (data.Response === 'False') return null;
      return normalizeResult(data);
    } catch (error) {
      console.error('OMDB Details Error:', error);
      return null;
    }
  }
};
