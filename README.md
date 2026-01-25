# 🎬 FilmVault Premium

**FilmVault Premium** is a high-end, **Mobile-First Web Application** designed for dedicated cinephiles. While it provides a native-feeling experience inspired by platforms like Letterboxd, it is built using modern web standards to ensure accessibility across all devices.

## 🌟 The Vision

FilmVault isn't just a list; it's a sanctuary for your cinematic journey. By bridging the gap between raw data from The Movie Database (TMDB) and intelligent analysis via the Gemini API, the app provides users with more than just posters—it provides context, "hot takes," and personalized vibe assessments of their collections.

## 🚀 Core Features

### 1. Discovery Engine
*   **Real-time Trending**: Stay updated with the global pulse of cinema via the "Trending Now" hero section.
*   **Archive Search**: Seamlessly browse millions of titles across Movies and TV Shows.
*   **Structured Filtering**: Categorize your discovery experience with quick-toggle filters.

### 2. The Vault System
*   **Custom Curation**: Create unlimited "Vaults" (watchlists) for specific moods, years, or genres (e.g., "Cyberpunk Noir," "2026 Oscar Race").
*   **Core Favorites**: A system-protected "Favorites" vault for your top picks.
*   **Already Watched**: Automatically tracks your cinematic history as you mark items as seen.
*   **Vault Intelligence**: AI-powered analysis that summarizes the "vibe" of your entire collection.

### 3. Cinephile Intelligence
*   **Cinephile Hot Takes**: Every movie detail page features an AI-generated insight to help you decide what to watch next.
*   **Dynamic Metadata**: Rich details including ratings, cast info, and high-resolution backdrop headers.

### 4. Premium UX & Design
*   **Mobile-First Web Architecture**: Built with React (Web), not React Native, but optimized for mobile browsers with touch-friendly interactions and a 2XL max-width constraint for desktop viewing.
*   **Dark Cinema Theme**: Deep charcoal backgrounds (#14181c) with high-contrast accents (Letterboxd Green and Orange).
*   **Animated Interactions**: "Heart Pop" animations and smooth transitions for a native mobile feel.

## 🛠 Tech Stack

*   **Frontend**: React 19 (Web / ESM-based architecture)
*   **Styling**: Tailwind CSS (Optimized for mobile-first responsiveness)
*   **Language**: TypeScript
*   **State Management**: Zustand
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

---

*“Cinema is a matter of what's in the frame and what's out.” – Martin Scorsese*