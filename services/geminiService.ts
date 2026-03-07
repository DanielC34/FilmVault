
export const geminiService = {
  getMovieInsight: async (movieTitle: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/movie-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle }),
      });
      const data = await res.json();
      return data.text || "An essential piece of cinematic history.";
    } catch (error) {
      console.error("Gemini insight fetch error:", error);
      return "An essential piece of cinematic history.";
    }
  },

  getWatchlistSummary: async (movies: string[]): Promise<string> => {
    try {
      const res = await fetch('/api/ai/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titles: movies }),
      });
      const data = await res.json();
      return data.text || "The Vibe: A dedicated cinephile building a legacy collection.";
    } catch (error) {
      console.error("Gemini vibe fetch error:", error);
      return "The Vibe: A dedicated cinephile building a legacy collection.";
    }
  }
};
