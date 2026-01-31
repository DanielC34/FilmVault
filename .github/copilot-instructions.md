# FilmVault AI Agent Instructions

## Project Overview
**FilmVault Premium** is a mobile-first React web app for film enthusiasts. It fetches trending movies/TV from TMDB, enables AI-powered insights via Gemini, and manages personal "Vaults" (watchlists) through Supabase. The app uses TypeScript, Zustand for state, Tailwind CSS, and Vite.

## Core Architecture

### Service Layer (Source of Truth)
- **`services/tmdbService.ts`**: Fetches trending/search data with normalization to `Movie` type
- **`services/geminiService.ts`**: Generates "cinephile hot takes" and vault vibes via Gemini API (`gemini-3-flash-preview`)
- **`services/supabaseClient.ts`**: Manages auth and vault data; checks `isSupabaseConfigured()` before real API calls
- **`services/supabaseMock.ts`**: Fallback for local development when Supabase credentials aren't configured

### State Management (Zustand Store)
**`store/useStore.ts`** is the single source of truth:
- Exposes session, user, watchlists, trending/search results, pagination, and toast notifications
- Handles auth flow (email/password, Google OAuth, guest mode) with Supabase fallback
- Automatically loads user data via `loadUserData()` on auth success
- Manages watchlist CRUD and media item operations (add/remove/toggle watched)

### UI Architecture (`components/`)
- **`App.tsx`**: Main orchestrator—manages 4 tabs (home, search, lists, profile), modals, and filters
- **Layout.tsx**: Navigation bar with tab switching
- **MovieCard.tsx**, **MovieDetailModal.tsx**: Display media with poster/backdrop; trigger AI insights on demand
- **AddToWatchlistSheet.tsx**, **CreateWatchlistModal.tsx**: Manage vault curation
- **Skeletons.tsx**: Loading states for cards and vaults
- **AuthScreen.tsx**, **GoogleLoginButton.tsx**: Auth UI with grace degradation

## Key Data Models (types.ts)
```typescript
Movie {id, title, overview, poster_path, backdrop_path, release_date, vote_average, media_type}
Watchlist {id, user_id, title, description, created_at, is_system_list}
WatchlistItem {id, watchlist_id, media_id, media_type, title, poster_path, added_at, is_watched}
```

## Critical Patterns

### Environment Configuration
- Vite loads `GEMINI_API_KEY` from `.env` and injects into `process.env` (see `vite.config.ts`)
- TMDB API key is hardcoded in `tmdbService.ts` (public key, acceptable for frontend)
- Supabase credentials are placeholders; agents should detect and warn if not configured

### API Data Normalization
- TMDB returns mixed `movie` and `tv` results; **always normalize via `normalizeResult()`** to ensure consistent `Movie` type
- Filter out `media_type: 'person'` results to avoid casting errors

### Auth Flow with Graceful Fallback
1. On `init()`, try real Supabase auth
2. If unconfigured, fall back to `supabaseMock` + localStorage
3. Check `isSupabaseConfigured()` before calling Supabase methods (prevents errors)

### Component Lifecycle
- **Modals**: Use React state (`useState`) to control visibility; pass `onClose` callbacks
- **Sheets**: Similar pattern; `AddToWatchlistSheet` auto-closes after adding
- **Pagination**: Separate pages for trending vs. search; update store before re-fetching

### Styling Conventions
- **Tailwind-only** (no inline CSS or styled components)
- **Color palette**: Dark theme (#14181c bg, #1a2128 surface) with Letterboxd green (#00e054) + orange (#ff8000) accents
- **Icons**: All from `lucide-react` (imported in `constants.tsx`)
- **Responsive**: Mobile-first; cap desktop at 2XL width (handled at `Layout` level)

## Common Workflows

### Add New Movie Metadata Field
1. Extend `Movie` type in `types.ts`
2. Update `normalizeResult()` in `tmdbService.ts` to map TMDB response → new field
3. Update `MovieCard.tsx` and `MovieDetailModal.tsx` to display

### Add AI Feature
1. Extend `geminiService.ts` with new method using `ai.models.generateContent()`
2. Add corresponding action in `store/useStore.ts` to call the service
3. Expose action via store hook in components
4. Example: `getMovieInsight()` is already implemented; follow its error-handling pattern

### Modify Watchlist Persistence
1. Update Supabase RLS policies in `sql/migration_favorites.sql` if needed
2. Adjust the corresponding method in `store/useStore.ts` (e.g., `addToWatchlist()`)
3. Ensure fallback behavior works in `supabaseMock.ts` for local dev

## Build & Run
```bash
npm run dev      # Vite dev server on port 3000
npm run build    # TypeScript + Vite production bundle
npm run preview  # Preview built output
```

## Debugging Tips
- **Auth issues**: Check `isSupabaseConfigured()` and verify `.env` setup
- **TMDB 404s**: Validate poster/backdrop paths exist; fallback images handled in `MovieCard`
- **Gemini timeouts**: Service already includes try-catch with fallback copy
- **Type errors**: Ensure `Movie` type consistency across API calls; use `normalizeResult()`
