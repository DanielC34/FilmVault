# 🚀 React Native Migration - START HERE

## ✨ What You Have

A **complete React Native mobile app** (Phase 1-3 done) with:

- ✅ 4 working tabs (Home, Search, Lists, Profile)
- ✅ Full authentication (email, Google, guest)
- ✅ TMDB integration for trending & search
- ✅ Watchlist/vault management
- ✅ Dark theme (Letterboxd colors)
- ✅ NativeWind styling
- ✅ Zustand state management
- ✅ AsyncStorage persistence
- ✅ Expo Router navigation

**Ready to run on iOS/Android** with Expo Go!

---

## 🎯 First Steps (Choose One)

### Option A: Run on Your Phone (Fastest - 2 min)

```bash
# 1. Install Expo Go from App Store / Play Store

# 2. In terminal
cd mobile
npm install
npm run dev

# 3. Scan QR code with Expo Go
# Done! 🎉
```

### Option B: iOS Simulator (macOS)

```bash
cd mobile
npm install
npm run dev:ios
```

### Option C: Android Emulator

```bash
# First: Set up Android emulator (see Android Studio)

cd mobile
npm install
npm run dev:android
```

---

## 📋 Installation Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo CLI (`npm install -g expo-cli`)
- [ ] Expo Go app installed (from App Store / Play Store)
- [ ] Running in `mobile/` folder
- [ ] `.env` file created with GEMINI_API_KEY (optional)

---

## 🧪 What to Test First

After `npm run dev`:

1. **Home Tab**

   - [ ] See trending movies loading
   - [ ] Scroll through grid
   - [ ] Click "Next Page" for pagination
   - [ ] Heart icon toggles favorite

2. **Search Tab**

   - [ ] Type in search box
   - [ ] Results appear in real-time
   - [ ] Tap movie to see info

3. **Lists Tab**

   - [ ] See "Favorites" vault
   - [ ] Click "+" to create new vault
   - [ ] Fill in name and description
   - [ ] Click "Create"

4. **Profile Tab**

   - [ ] See user info
   - [ ] Click "Sign Out"

5. **Auth**
   - [ ] Log in as guest
   - [ ] Then sign out
   - [ ] Tap guest mode again

---

## 📁 Key Files to Know

| File                     | Purpose          | Status    |
| ------------------------ | ---------------- | --------- |
| `app/_layout.tsx`        | Root navigation  | ✅        |
| `app/(tabs)/_layout.tsx` | Bottom tabs      | ✅        |
| `app/(tabs)/home.tsx`    | Trending screen  | ✅        |
| `app/(tabs)/search.tsx`  | Search screen    | ✅        |
| `app/(tabs)/lists.tsx`   | Vaults screen    | ✅        |
| `app/(tabs)/profile.tsx` | Profile screen   | ✅        |
| `store/useStore.ts`      | State management | ✅        |
| `constants.ts`           | Theme & colors   | ✅        |
| `app.json`               | Expo config      | ✅        |
| `.env`                   | Gemini API key   | Create it |

---

## 🎬 After First Test

Once you confirm it works on Expo Go:

### Next: Phase 4 Modals (Recommended)

Create movie detail view:

```bash
# See PHASE_4_TEMPLATES.md for code samples
```

### Or: Test on Simulators

```bash
npm run dev:ios      # macOS only
npm run dev:android
```

### Or: Build for Release

```bash
npm run build:ios
npm run build:android
```

---

## 🔧 Common Issues

### "Command not found: expo"

```bash
npm install -g expo-cli
```

### "AsyncStorage not found"

```bash
cd mobile
npm install
```

### "Tailwind classes not working"

- Rebuild: `npm run dev` (stop and restart)
- Check NativeWind babel config

### "Images not loading"

- Check internet connection
- Verify TMDB API (used by services)

### "Sign in fails"

- Use Guest Mode (always works)
- Supabase optional - not needed for testing

---

## 📖 Documentation Map

```
For Setup:                → mobile/README.md
For What's Done:          → REACT_NATIVE_IMPLEMENTATION.md
For Next Steps:           → MIGRATION_STATUS.md
For Phase 4 Templates:    → PHASE_4_TEMPLATES.md
For Quick Help:           → QUICK_REFERENCE.md
For Migration Plan:       → REACT_NATIVE_MIGRATION_PLAN.md
```

---

## ✅ Success Criteria

You'll know it's working when:

- [ ] `npm run dev` shows QR code
- [ ] Expo Go app opens and shows app
- [ ] Can navigate all 4 tabs
- [ ] Can see trending movies
- [ ] Can search
- [ ] Can create vault
- [ ] Can sign out

---

## 🎯 Your Next Action

```bash
cd mobile
npm install
npm run dev
# Scan QR with Expo Go
```

That's it! You're running FilmVault on React Native! 🎉

---

## 💬 Questions?

- **"How do I add features?"** → See `PHASE_4_TEMPLATES.md`
- **"How do I deploy?"** → See `mobile/README.md`
- **"What's still TODO?"** → See `MIGRATION_STATUS.md`
- **"How does it work?"** → See `.github/copilot-instructions.md`

---

**Let me know when you get it running! 🚀**
