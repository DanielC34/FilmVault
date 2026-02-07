import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useStore } from "../../store/useStore";
import MovieCard from "../../components/MovieCard";
import AuthScreen from "../../components/AuthScreen";
import { THEME } from "../../constants";

export default function HomeScreen() {
  const {
    session,
    isAuthLoading,
    trendingMovies,
    isLoading,
    trendingPage,
    totalTrendingPages,
    setTrendingPage,
    favoriteIds,
    toggleFavorite,
  } = useStore();

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (isAuthLoading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={trendingMovies}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={(movie) => setSelectedMovie(movie)}
            isFavorite={favoriteIds.has(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ flex: 1 }}
        contentContainerStyle={{ padding: 8 }}
        ListFooterComponent={
          trendingPage < totalTrendingPages ? (
            <View className="flex-row gap-2 py-4 px-4">
              {trendingPage > 1 && (
                <Pressable
                  onPress={() => setTrendingPage(trendingPage - 1)}
                  disabled={isLoading}
                  className="flex-1 bg-surface p-3 rounded-lg active:opacity-80"
                >
                  <Text className="text-primary text-center font-semibold">
                    Previous
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setTrendingPage(trendingPage + 1)}
                disabled={isLoading}
                className="flex-1 bg-primary p-3 rounded-lg active:opacity-80"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={THEME.background} />
                ) : (
                  <Text className="text-bg text-center font-semibold">
                    Next Page
                  </Text>
                )}
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
