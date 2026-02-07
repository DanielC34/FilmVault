# 🎬 FilmVault React Native - Quick Reference

## 📱 Getting Started (60 seconds)

```bash
# 1. Navigate to mobile folder
cd mobile

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open Expo Go app on phone, scan QR code
```

## 🗂️ File Structure Quick Map

```
mobile/
├── app/                          # Screens (Expo Router)
│   ├── _layout.tsx              # Root with StatusBar
│   └── (tabs)/
│       ├── _layout.tsx          # Bottom navigation (4 tabs)
│       ├── home.tsx             # Trending movies
│       ├── search.tsx           # Movie search
│       ├── lists.tsx            # Vault management
│       └── profile.tsx          # User profile
│
├── components/
│   ├── MovieCard.tsx            # Movie card component
│   └── AuthScreen.tsx           # Auth form component
│
├── services/                     # API logic (shared from web)
│   ├── tmdbService.ts           # TMDB API
│   ├── geminiService.ts         # Gemini AI
│   ├── supabaseClient.ts        # Supabase config
│   └── supabaseMock.ts          # LocalStorage → AsyncStorage
│
├── store/
│   └── useStore.ts              # Zustand state (with AsyncStorage)
│
├── types.ts                      # TypeScript interfaces
├── constants.ts                  # Theme, colors, fonts
├── app.json                      # Expo config
└── tailwind.config.js            # NativeWind config
```

## 🎯 Common Tasks

### View Trending Movies (Home Tab)

✅ Done - `app/(tabs)/home.tsx`

### Search Movies (Search Tab)

✅ Done - `app/(tabs)/search.tsx`

### Manage Vaults (Lists Tab)

✅ Done - `app/(tabs)/lists.tsx`

- View all vaults
- Create new vault (modal)
- Delete custom vaults

### User Profile (Profile Tab)

✅ Done - `app/(tabs)/profile.tsx`

- Display user info
- Sign out button

### Show Movie Details

🔲 TODO - `app/modals/movie-detail.tsx` (see PHASE_4_TEMPLATES.md)

### Add to Watchlist

🔲 TODO - `app/modals/add-to-watchlist.tsx` (see PHASE_4_TEMPLATES.md)

### Authenticate User

✅ Done - Email, password, Google OAuth, guest mode

---

## 🎨 Styling with NativeWind

```tsx
// Before (web)
<div className="flex p-4 bg-surface rounded-lg">
  <p className="text-white">Hello</p>
</div>

// After (mobile)
<View className="flex p-4 bg-surface rounded-lg">
  <Text className="text-white">Hello</Text>
</View>
```

**Custom Colors** (tailwind.config.js):

- `bg` - `#14181c` (dark background)
- `surface` - `#1a2128` (card background)
- `primary` - `#00e054` (Letterboxd green)
- `accent` - `#ff8000` (Letterboxd orange)
- `textMuted` - `#9ab` (gray text)
- `error` - `#ff6b6b` (red)
- `success` - `#51cf66` (green)

---

## 🔄 State Management (Zustand + AsyncStorage)

```tsx
import { useStore } from "./store/useStore";

// In component
const {
  trendingMovies, // Movie[]
  searchQuery, // string
  setSearchQuery, // (q: string) => void
  watchlists, // Watchlist[]
  addToWatchlist, // (id: string, movie: Movie) => Promise<void>
  session, // Auth session
  signInAsGuest, // () => Promise<void>
  showToast, // (msg: string, type?: 'success'|'error'|'info') => void
} = useStore();
```

---

## 🚀 Build & Test Commands

```bash
# Development
npm run dev           # Expo Go (all devices)
npm run dev:ios      # iOS Simulator
npm run dev:android  # Android Emulator

# Production
npm run build:ios    # Build for App Store
npm run build:android # Build for Play Store
npm run build        # Build both + submit
```

---

## 📋 Component Reference

### MovieCard

```tsx
<MovieCard
  movie={movie}
  onPress={(m) => console.log(m)}
  isFavorite={favoriteIds.has(movie.id)}
  onToggleFavorite={toggleFavorite}
/>
```

### AuthScreen

```tsx
<AuthScreen /> // Automatically shown if not logged in
```

---

## 🔑 Environment Setup

Create `mobile/.env`:

```
GEMINI_API_KEY=sk-...your-key...
EXPO_PUBLIC_GEMINI_API_KEY=sk-...your-key...
```

---

## ✅ What's Implemented

- ✅ Bottom tab navigation (4 tabs)
- ✅ Trending movies with pagination
- ✅ Search with real-time results
- ✅ Vault management + create modal
- ✅ User profile + sign out
- ✅ Auth (email, password, Google, guest)
- ✅ Favorite toggle
- ✅ Dark theme (Letterboxd colors)
- ✅ Responsive layout
- ✅ Movie card component
- ✅ Auth UI

## 🔲 What's TODO

- 🔲 Movie detail modal (Phase 4)
- 🔲 Add to watchlist sheet (Phase 4)
- 🔲 AI insights modal (Phase 4)
- 🔲 Animations (Phase 4)
- 🔲 Vault detail screen (Phase 4)
- 🔲 iOS/Android testing (Phase 5)
- 🔲 Performance optimization (Phase 5)
- 🔲 Deep linking (Phase 7)

---

## 🐛 Quick Debugging

**Images not loading?**

- Check `TMDB_IMAGE_BASE` in constants.ts
- Verify internet connection

**Auth not working?**

- Use Guest Mode to test locally
- Check GEMINI_API_KEY in .env
- Supabase optional (falls back to mock)

**App crashing?**

- Check console with `npm run dev`
- Look for TypeScript errors

**Hot reload not working?**

- Save file again
- Or press 'R' in terminal

---

## 📚 Documentation

- **Setup**: `mobile/README.md`
- **Status**: `../MIGRATION_STATUS.md`
- **Implementation**: `../REACT_NATIVE_IMPLEMENTATION.md`
- **Phase 4**: `../PHASE_4_TEMPLATES.md`

---

## 🎯 Next Priority

1. ✅ **Confirm Expo Go works** - `npm run dev` and test on phone
2. 🔲 **Implement movie detail modal** - Show full info + AI insights
3. 🔲 **Add animations** - Heart pop effect
4. 🔲 **Test on simulators** - iOS/Android
5. 🔲 **Optimize performance** - FlatList, memoization
6. 🔲 **Build for release** - App Store/Play Store

---

**Ready to test?** Run `npm run dev` in the `mobile/` folder! 🚀
