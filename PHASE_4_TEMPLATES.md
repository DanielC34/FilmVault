# Phase 4: Modals & Enhanced Features

## Movie Detail Modal

Create `app/modals/movie-detail.tsx`:

```tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Heart, X } from "lucide-react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { tmdbService } from "../../services/tmdbService";
import { geminiService } from "../../services/geminiService";
import { useStore } from "../../store/useStore";
import { THEME, TMDB_IMAGE_BASE, BACKDROP_SIZE } from "../../constants";

export default function MovieDetailModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params as { movie: Movie };

  const [insight, setInsight] = useState<string>("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const { toggleFavorite, favoriteIds, addToWatchlist } = useStore();

  useEffect(() => {
    loadInsight();
  }, [movie.id]);

  const loadInsight = async () => {
    setIsLoadingInsight(true);
    const text = await geminiService.getMovieInsight(movie.title);
    setInsight(text);
    setIsLoadingInsight(false);
  };

  return (
    <ScrollView className="flex-1 bg-bg">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <Image
          source={{
            uri: `${TMDB_IMAGE_BASE}${BACKDROP_SIZE}${movie.backdrop_path}`,
          }}
          style={{ width: "100%", height: 250 }}
        />
      )}

      {/* Close Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
      >
        <X size={24} color={THEME.text} />
      </Pressable>

      {/* Content */}
      <View className="p-4">
        {/* Title & Rating */}
        <Text className="text-3xl font-bold text-white mb-2">
          {movie.title}
        </Text>
        {movie.vote_average > 0 && (
          <Text className="text-lg text-accent mb-4">
            ⭐ {movie.vote_average.toFixed(1)}/10
          </Text>
        )}

        {/* AI Insight */}
        {isLoadingInsight ? (
          <ActivityIndicator size="large" color={THEME.primary} />
        ) : (
          <View className="bg-surface rounded-lg p-4 mb-4">
            <Text className="text-sm text-textMuted uppercase mb-2">
              Cinephile Hot Take
            </Text>
            <Text className="text-white">{insight}</Text>
          </View>
        )}

        {/* Overview */}
        {movie.overview && (
          <View className="mb-4">
            <Text className="text-white font-semibold mb-2">Overview</Text>
            <Text className="text-textMuted">{movie.overview}</Text>
          </View>
        )}

        {/* Release Date */}
        {movie.release_date && (
          <View className="mb-4">
            <Text className="text-textMuted text-sm">
              Released: {new Date(movie.release_date).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => toggleFavorite(movie)}
            className="flex-1 flex-row items-center justify-center gap-2 bg-accent/20 p-3 rounded-lg active:opacity-80"
          >
            <Heart
              size={20}
              color={THEME.accent}
              fill={favoriteIds.has(movie.id) ? THEME.accent : "none"}
            />
            <Text className="text-accent font-semibold">Favorite</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              /* Open watchlist sheet */
            }}
            className="flex-1 bg-primary p-3 rounded-lg active:opacity-80"
          >
            <Text className="text-bg text-center font-semibold">+ Add</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
```

## Add to Watchlist Sheet

Create `app/modals/add-to-watchlist.tsx`:

```tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Plus, X } from "lucide-react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useStore } from "../../store/useStore";
import { THEME } from "../../constants";

export default function AddToWatchlistModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie } = route.params as { movie: Movie };

  const { watchlists, addToWatchlist, createWatchlist } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleAddToWatchlist = async (watchlistId: string) => {
    await addToWatchlist(watchlistId, movie);
    navigation.goBack();
  };

  const handleCreateAndAdd = async () => {
    if (!newListName.trim()) return;
    setIsCreating(true);
    const newList = await createWatchlist(newListName, "");
    if (newList) {
      await addToWatchlist(newList.id, movie);
      navigation.goBack();
    }
    setIsCreating(false);
  };

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-surface">
        <Text className="text-lg font-bold text-white">Add to Vault</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <X size={24} color={THEME.text} />
        </Pressable>
      </View>

      {/* Watchlists */}
      <FlatList
        data={watchlists}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleAddToWatchlist(item.id)}
            className="flex-row items-center px-4 py-4 border-b border-surface active:bg-surface"
          >
            <View className="flex-1">
              <Text className="text-white font-semibold">{item.title}</Text>
              <Text className="text-textMuted text-xs">
                {item.item_count || 0} items
              </Text>
            </View>
            <Plus size={20} color={THEME.primary} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Create New */}
      <View className="border-t border-surface p-4 gap-2">
        <TextInput
          className="bg-surface text-white p-3 rounded-lg border border-surface"
          placeholder="Create new vault..."
          placeholderTextColor={THEME.textMuted}
          value={newListName}
          onChangeText={setNewListName}
        />
        <Pressable
          onPress={handleCreateAndAdd}
          disabled={isCreating}
          className="bg-primary p-3 rounded-lg active:opacity-80"
        >
          {isCreating ? (
            <ActivityIndicator size="small" color={THEME.background} />
          ) : (
            <Text className="text-bg text-center font-semibold">
              Create & Add
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
```

## Navigation Integration

Update `app/(tabs)/_layout.tsx` to link modals:

```tsx
// Add modal screens
<Stack.Group screenOptions={{ presentation: "modal" }}>
  <Stack.Screen name="movie-detail" options={{ title: "Movie" }} />
  <Stack.Screen name="add-to-watchlist" options={{ title: "Add to Vault" }} />
</Stack.Group>
```

Then in MovieCard.tsx:

```tsx
const navigation = useNavigation();
onPress={() => navigation.navigate('movie-detail', { movie })}
```

---

## Animation: Heart Pop

Install React Native Reanimated:

```bash
npm install react-native-reanimated
```

Create `components/AnimatedHeartButton.tsx`:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Heart } from "lucide-react-native";

export default function AnimatedHeartButton({ isFavorite, onPress }) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(1.5, { damping: 8, mass: 1 }, () => {
      scale.value = withSpring(1, { damping: 8, mass: 1 });
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        <Heart
          size={20}
          color={isFavorite ? "#ff8000" : "#fff"}
          fill={isFavorite ? "#ff8000" : "none"}
        />
      </Pressable>
    </Animated.View>
  );
}
```

---

**Ready to implement Phase 4!** These templates provide a starting point for modals and animations.
