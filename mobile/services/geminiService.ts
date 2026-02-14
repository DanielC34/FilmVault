import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  getMovieInsight: async (movieTitle: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a one-sentence "cinephile hot take" on why a movie fan must watch "${movieTitle}". Keep it professional but edgy, like a Criterion Collection essay snippet.`,
      });
      return response.text || "A modern masterpiece that defies convention.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An essential piece of cinematic history.";
    }
  },

  getWatchlistSummary: async (movies: string[]) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this watchlist: ${movies.join(
          ", "
        )}, describe the "vibe" of this movie fan in two sentences. Start with "The Vibe:".`,
      });
      return (
        response.text ||
        "The Vibe: Eclectic and adventurous with a taste for visual storytelling."
      );
    } catch (error) {
      console.error("Gemini Watchlist Error:", error);
      return "The Vibe: A dedicated cinephile building a legacy collection.";
    }
  },
};
