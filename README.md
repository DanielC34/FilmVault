# 🎬 FilmVault Premium

**FilmVault Premium** is a high-end, mobile-first cinema tracking application designed for dedicated cinephiles. Inspired by the social and organizational elements of platforms like Letterboxd, FilmVault elevates the experience with a "Dark Cinema" aesthetic, AI-driven insights, and a sophisticated "Vault" system for media curation.

## 🌟 The Vision

FilmVault isn't just a list; it's a sanctuary for your cinematic journey. By bridging the gap between raw data from The Movie Database (TMDB) and intelligent analysis via the Gemini API, the app provides users with more than just posters—it provides context, "hot takes," and personalized vibe assessments of their collections.

## 🚀 Core Features

### 1. Discovery Engine
*   **Real-time Trending**: Stay updated with the global pulse of cinema via the "Trending Now" hero section.
*   **Archive Search**: Seamlessly browse millions of titles across Movies and TV Shows.
*   **Structured Filtering**: Categorize your discovery experience with quick-toggle filters.

### 2. The Vault System
*   **Custom Curation**: Create unlimited "Vaults" (watchlists) for specific moods, years, or genres (e.g., "Cyberpunk Noir," "2026 Oscar Race").
*   **Core Favorites**: A system-protected "Favorites" vault that powers high-performance interactions and cannot be deleted.
*   **Vault Intelligence**: AI-powered analysis that summarizes the "vibe" of your entire collection.

### 3. Cinephile Intelligence
*   **Cinephile Hot Takes**: Every movie detail page features an AI-generated, edgy, professional insight to help you decide what to watch next.
*   **Dynamic Metadata**: Rich details including ratings, cast info, and high-resolution backdrop headers.

### 4. Premium UX & Design
*   **Dark Cinema Theme**: Deep charcoal backgrounds (#14181c) with high-contrast accents (Letterboxd Green and Orange).
*   **Cinematic Skeletons**: Custom-designed pulse loading states ensure the app feels fast and responsive even while fetching remote data.
*   **Animated Interactions**: "Heart Pop" animations and smooth transitions for a native mobile feel.

## 🛠 Tech Stack

*   **Frontend**: React 19 (ESM-based architecture)
*   **Styling**: Tailwind CSS
*   **Language**: TypeScript
*   **State Management**: Zustand (with persistent lookup sets)
*   **AI Engine**: Gemini API (`@google/genai`)
*   **Data Source**: The Movie Database (TMDB) API
*   **Backend Interface**: Supabase (PostgreSQL with RLS support)
*   **Iconography**: Lucide React

## 📦 Project Structure

```text
├── components/          # Modular UI components (Modals, Lists, Skeletons)
├── services/            # API integration (TMDB, Gemini, Supabase)
├── store/               # Centralized Zustand state logic
├── sql/                 # Database migrations and RLS policies
├── types.ts             # Domain models and TypeScript definitions
├── constants.tsx        # UI theme, icons, and API configurations
└── App.tsx              # Main application orchestrator
```

## 🔑 Environment Requirements

To run this application, the following environment variables are utilized:
*   `API_KEY`: Your Google Gemini API key for generating cinephile insights.
*   `TMDB_API_KEY`: Integrated directly for movie metadata (Standard TMDB v3).

## 📚 Resources & Credits

*   **Media Data**: Provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
*   **AI Insights**: Powered by the **Gemini 3 Flash** model for high-latency, professional text generation.
*   **Design Language**: Inspired by high-end cinema boutiques and modern tracking apps.
*   **Icons**: [Lucide](https://lucide.dev/) for clean, readable interface elements.

---

*“Cinema is a matter of what's in the frame and what's out.” – Martin Scorsese*
