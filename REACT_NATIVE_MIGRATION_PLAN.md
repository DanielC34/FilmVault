# React Native Migration Plan for FilmVault

## Overview

Migrate FilmVault from React Web (Vite) to React Native (Expo) to create a native mobile app. This maintains all functionality while optimizing for iOS/Android platforms.

---

## Phase 1: Project Setup & Dependencies

### 1.1 Initialize React Native Project

- Use **Expo** as the framework (faster development, easier deployment)
- Create new project: `npx create-expo-app FilmVault-RN` or `expo init`
- Delete web-specific files: `vite.config.ts`, `index.html`, `tsconfig.json` (use Expo's)
- Keep `package.json` scripts but update them for Expo

### 1.2 Update Dependencies

**Remove:**

- `react-dom` (web-only)
- `vite` & `@vitejs/plugin-react` (Vite bundler)
- `lucide-react` (web icons)
- Any CSS frameworks

**Add:**

- `react-native`
- `expo`
- `@react-navigation/native` + `@react-navigation/bottom-tabs` (tab navigation)
- `@react-native-async-storage/async-storage` (replaces localStorage)
- `lucide-react-native` (mobile icons)
- `react-native-gesture-handler` (gesture support)
- `react-native-safe-area-context` (safe area handling)
- `nativewind` OR `react-native-tailwind` (Tailwind for RN, optional)
- `@supabase/supabase-js` (already compatible)
- `@google/genai` (already compatible)

### 1.3 File Structure Changes

```
FilmVault-RN/
├── app/
│   ├── index.tsx              (Root navigator)
│   ├── (tabs)/
│   │   ├── home.tsx           (Home tab)
│   │   ├── search.tsx         (Search tab)
│   │   ├── lists.tsx          (Vaults tab)
│   │   └── profile.tsx        (Profile tab)
│   └── modals/
│       ├── movie-detail.tsx
│       ├── create-vault.tsx
│       └── add-to-watchlist.tsx
├── services/                  (no changes)
├── store/                     (no changes)
├── components/
│   ├── MovieCard.tsx
│   ├── VaultCard.tsx
│   ├── ToastNotification.tsx
│   └── ...
├── constants.ts              (update for RN)
├── types.ts                  (no changes)
└── app.json                  (Expo config)
```

---

## Phase 2: Core Infrastructure Updates

### 2.1 Constants & Theme (`constants.ts`)

- **Remove**: CSS class definitions, Tailwind utilities
- **Keep**: THEME colors, TMDB_IMAGE_BASE, image sizes
- **Add**: React Native `StyleSheet` definitions
- **Add**: Spacing scale (8px grid system)

Example:

```typescript
import { StyleSheet } from "react-native";

export const STYLES = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  text: { color: THEME.text, fontSize: 16 },
  // ...
});
```

### 2.2 Environment Configuration

- Create `.env` file (Expo handles it automatically)
- `vite.config.ts` → `app.json` (Expo configuration)
- Keep `GEMINI_API_KEY` in `.env`
- Supabase credentials remain the same

### 2.3 Storage: localStorage → AsyncStorage

**In `store/useStore.ts`:**

```typescript
// Replace localStorage with AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Change:
const mockSession = localStorage.getItem("fv_mock_session");
// To:
const mockSession = await AsyncStorage.getItem("fv_mock_session");
```

---

## Phase 3: Component Migration

### 3.1 Layout & Navigation Structure

**Old (Web):** Tabs managed via React state in `App.tsx`  
**New (RN):** Bottom tab navigation via `@react-navigation/bottom-tabs`

Replace `Layout.tsx` + `App.tsx` with:

```typescript
// app/index.tsx - Root navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Tab screens in app/(tabs)/home.tsx, search.tsx, etc.
```

### 3.2 Component Rewrites (Critical)

Each component needs to change from web to native:

| Web Component   | React Native Equivalent               |
| --------------- | ------------------------------------- |
| `<div>`         | `<View>`                              |
| `<p>`, `<span>` | `<Text>`                              |
| `<img>`         | `<Image>`                             |
| `<input>`       | `<TextInput>`                         |
| `<button>`      | `<Pressable>` or `<TouchableOpacity>` |
| `<section>`     | `<View>`                              |
| CSS classes     | `StyleSheet.create()`                 |
| modal dialogs   | `@react-navigation/native` modals     |
| scrollable div  | `<ScrollView>` or `<FlatList>`        |

### 3.3 Component List (11 files to migrate)

1. **MovieCard.tsx** - Display movie with poster/rating (use `<Image>`, `<Pressable>`)
2. **MovieDetailModal.tsx** - Full movie details modal (use navigation modal)
3. **AddToWatchlistSheet.tsx** - Bottom sheet for watchlist selection (use `react-native-bottom-sheet` or modal)
4. **CreateWatchlistModal.tsx** - Create vault modal (use navigation modal)
5. **AuthScreen.tsx** - Login/signup screen (use `<TextInput>`, `<Pressable>`)
6. **GoogleLoginButton.tsx** - Google OAuth (use `expo-google-app-auth` or similar)
7. **Layout.tsx** - Tab navigation (replace with bottom tab navigator)
8. **Pagination.tsx** - Next/prev buttons (update styling for mobile)
9. **Skeletons.tsx** - Loading placeholders (update for RN)
10. **ToastNotification.tsx** - Toast notifications (use `react-native-toast-message` or Zustand)
11. **FavoriteButton.tsx** - Heart animation (use `react-native-reanimated` for smooth animations)

### 3.4 Styling Strategy

**Option A (Recommended):** React Native `StyleSheet` + inline styles

```typescript
const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 8, backgroundColor: "#1a2128" },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});
```

**Option B:** NativeWind (Tailwind for React Native)

```typescript
<View className="p-4 rounded-lg bg-surface">
  <Text className="text-lg font-bold text-white">Title</Text>
</View>
```

Recommend **Option A** for fine control; Option B for faster migration.

---

## Phase 4: Feature-Specific Migrations

### 4.1 Modal & Sheet Handling

- **Modal dialogs** → Use `@react-navigation/native` modal screens
- **Bottom sheets** → Use `react-native-bottom-sheet` or simple modal
- Replace React state (`useState`) with navigation params

### 4.2 Animations

- **Heart pop animation** (FavoriteButton) → Use `react-native-reanimated`
- Remove CSS keyframes; use native animation driver

### 4.3 Image Handling

- **TMDB image loading** → Use `<Image>` with `resizeMode="cover"`
- Add fallback placeholder during load
- Cache images via `@react-native-community/image-cache-hoc` (optional)

### 4.4 Keyboard & Input

- Add `react-native-keyboard-aware-scroll-view` for auth forms
- Handle keyboard dismiss on tap (use `<TouchableWithoutFeedback>`)

### 4.5 Deep Linking (Optional for Phase 1)

- Handle movie detail URLs via `expo-linking`
- Configure `app.json` with `deepLinking` config

---

## Phase 5: Testing & Debugging

### 5.1 Build Scripts

```json
{
  "scripts": {
    "dev": "expo start",
    "dev:ios": "expo start --ios",
    "dev:android": "expo start --android",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "test": "jest"
  }
}
```

### 5.2 Testing Areas

- [ ] TMDB API calls (same as web)
- [ ] Gemini integration (same as web)
- [ ] Supabase auth (test on RN)
- [ ] Supabase mock fallback (test on RN)
- [ ] AsyncStorage persistence
- [ ] Tab navigation
- [ ] Modal/sheet transitions
- [ ] Image loading
- [ ] Touch interactions

### 5.3 Device Testing

- Test on iOS simulator (Xcode)
- Test on Android emulator (Android Studio)
- Test on real devices via Expo Go app

---

## Phase 6: Performance & Optimization

### 6.1 Optimizations

- Use `FlatList` with `maxToRenderPerBatch` for movie lists (instead of `ScrollView`)
- Memoize components with `React.memo()`
- Use `useFocusEffect` for tab-specific logic
- Lazy load movie details in modals

### 6.2 Bundle Size

- Tree-shake unused lucide icons
- Use dynamic imports for modals
- Test with `expo-bundle-analyzer`

---

## Phase 7: Platform-Specific Handling

### 7.1 Safe Areas

- Wrap screens with `<SafeAreaView>` for notches/rounded corners
- Use `useSafeAreaInsets()` hook for custom positioning

### 7.2 Platform Differences

```typescript
import { Platform } from "react-native";

if (Platform.OS === "ios") {
  // iOS-specific code
} else {
  // Android-specific code
}
```

### 7.3 Status Bar

- Configure status bar color in `app.json`
- Use `expo-status-bar` for dynamic updates

---

## Migration Checklist

### Setup Phase

- [ ] Initialize Expo project
- [ ] Update `package.json` dependencies
- [ ] Update `.env` for GEMINI_API_KEY
- [ ] Create folder structure (`app/`, `components/`, etc.)
- [ ] Update `types.ts` (no changes needed)
- [ ] Update `constants.ts` for React Native

### Service Layer (No Changes)

- [ ] `services/tmdbService.ts` - works as-is
- [ ] `services/geminiService.ts` - works as-is
- [ ] `services/supabaseClient.ts` - works as-is
- [ ] `services/supabaseMock.ts` - works as-is

### Store Layer

- [ ] Update `store/useStore.ts` - replace localStorage with AsyncStorage
- [ ] Test Zustand hooks on RN

### Components (Priority Order)

- [ ] **Phase 1 (Core):**
  - [ ] Layout → Bottom Tab Navigator
  - [ ] MovieCard
  - [ ] AuthScreen
- [ ] **Phase 2 (Modals):**
  - [ ] MovieDetailModal
  - [ ] CreateWatchlistModal
  - [ ] AddToWatchlistSheet
- [ ] **Phase 3 (Supporting):**
  - [ ] Pagination
  - [ ] Skeletons
  - [ ] ToastNotification
  - [ ] FavoriteButton
  - [ ] GoogleLoginButton

### Testing & Optimization

- [ ] Test all 4 tabs
- [ ] Test auth flow
- [ ] Test TMDB search
- [ ] Test watchlist operations
- [ ] Test Gemini AI features
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Performance profiling

---

## Expected Timeline

- **Phase 1 (Setup)**: 1-2 hours
- **Phase 2 (Infrastructure)**: 1-2 hours
- **Phase 3 (Components)**: 4-6 hours
- **Phase 4 (Features)**: 2-3 hours
- **Phase 5+ (Testing/Optimization)**: 2-4 hours

**Total: ~10-16 hours for functional React Native app**

---

## Risk Mitigation

1. **Keep web version** in separate branch for fallback
2. **Test incrementally** - migrate one tab at a time
3. **Mock Expo services** during early development
4. **Use Expo Go** for rapid testing (no build needed)
5. **Version dependencies carefully** - use exact versions where possible

---

## Questions Before Starting

1. Should we maintain the web version or fully replace it?
2. Do you want iOS + Android or just one platform initially?
3. Should we use NativeWind or native StyleSheet?
4. Any specific React Navigation version preference?
5. Should deep linking be included in Phase 1?
