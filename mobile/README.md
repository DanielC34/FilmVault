# FilmVault Mobile (React Native + Expo)

A native mobile app for iOS and Android built with React Native, Expo, and NativeWind.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Update .env with your GEMINI_API_KEY
```

### Development

```bash
# Start dev server
npm run dev

# For iOS simulator
npm run dev:ios

# For Android emulator
npm run dev:android

# Test on physical device via Expo Go
# Scan QR code from terminal with Expo Go app
```

### Build for Release

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android

# Automated build & submit
npm run build
```

## 📱 Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx              # Root navigator
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx
│   │   ├── home.tsx             # Trending
│   │   ├── search.tsx           # Search
│   │   ├── lists.tsx            # My Vaults
│   │   └── profile.tsx          # Profile
│   └── modals/                  # Modal screens (expandable)
├── components/                  # Reusable UI components
│   ├── MovieCard.tsx
│   ├── AuthScreen.tsx
│   └── ...
├── services/                    # API integration (TMDB, Gemini, Supabase)
├── store/                       # Zustand state management
├── types.ts                     # TypeScript definitions
├── constants.ts                 # Theme & constants
├── tailwind.config.js
├── app.json                     # Expo configuration
└── package.json
```

## 🎨 Styling with NativeWind

This app uses **NativeWind** for Tailwind CSS styling in React Native:

```tsx
<View className="flex-1 bg-bg p-4 rounded-lg">
  <Text className="text-white font-bold text-lg">Hello</Text>
</View>
```

Custom colors defined in `tailwind.config.js`:

- `bg`: `#14181c` (main background)
- `surface`: `#1a2128`
- `primary`: `#00e054` (Letterboxd green)
- `accent`: `#ff8000` (Letterboxd orange)

## 🔐 Auth & Persistence

- **Real Supabase**: Automatic sync when credentials configured
- **Mock Mode**: AsyncStorage-based fallback for dev
- Graceful degradation when Supabase unavailable

## 🎬 Core Features

### Trending

- Paginated daily trending movies/TV
- Image loading with placeholders
- Quick favorite toggle

### Search

- Real-time search across TMDB
- Paginated results
- Media type filtering

### My Vaults (Watchlists)

- Create custom collections
- System vaults: Favorites, Already Watched
- Add/remove items
- Delete custom vaults

### Profile

- User info display
- Sign out
- About section

## 🔌 Environment Setup

Create `mobile/.env`:

```
GEMINI_API_KEY=your-key-here
EXPO_PUBLIC_GEMINI_API_KEY=your-key-here
```

For Supabase (optional):

- Update `services/supabaseClient.ts` with real credentials
- Falls back to mock mode if not configured

## 📦 Key Dependencies

- **expo**: Dev platform & tooling
- **expo-router**: File-based routing
- **react-native**: Core framework
- **zustand**: State management
- **nativewind**: Tailwind CSS
- **@google/genai**: Gemini API
- **@supabase/supabase-js**: Backend
- **lucide-react-native**: Icons

## 🧪 Testing

### Expo Go (Fastest)

```bash
npm run dev
# Scan QR code with Expo Go app
```

### Simulators

```bash
npm run dev:ios    # iOS Simulator (macOS)
npm run dev:android # Android Emulator
```

### Physical Devices

- Build signed APK/IPA for distribution
- Use `npm run build:ios` and `npm run build:android`

## 🐛 Debugging

**Redux DevTools**:

- Zustand logs to console by default
- Use React DevTools for component inspection

**Network Inspector**:

```bash
# In dev terminal, press 'd' for menu
# Select 'Open JavaScript Debugger'
```

**Common Issues**:

- **Images not loading**: Check TMDB_IMAGE_BASE in constants
- **Supabase auth fails**: Verify credentials in supabaseClient.ts or use mock mode
- **API timeout**: Check internet connection and API limits

## 📋 Development Workflow

1. Create feature branch from `main`
2. Make changes in `mobile/` folder
3. Test on Expo Go (`npm run dev`)
4. Commit with descriptive messages
5. Submit PR with testing evidence

## 🚀 Deployment

### Automatic (EAS Build)

```bash
npm run build:ios
npm run build:android
```

### Manual

1. `expo prebuild` (generates native folders)
2. Build with Xcode or Android Studio
3. Submit to App Stores

## 📖 Additional Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Built with ❤️ for cinephiles**
