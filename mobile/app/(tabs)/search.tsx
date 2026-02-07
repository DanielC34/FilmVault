import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Search } from "lucide-react-native";
import { useStore } from "../../store/useStore";
import MovieCard from "../../components/MovieCard";
import AuthScreen from "../../components/AuthScreen";
import { THEME } from "../../constants";

export default function SearchScreen() {
  const {
    session,
    isAuthLoading,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    favoriteIds,
    toggleFavorite,
  } = useStore();

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
      <View className="px-4 py-4 border-b border-surface">
        <View className="flex-row items-center bg-surface rounded-lg px-3">
          <Search size={20} color={THEME.textMuted} />
          <TextInput
            className="flex-1 text-white p-3 ml-2"
            placeholder="Search movies, shows..."
            placeholderTextColor={THEME.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isLoading && (
            <ActivityIndicator size="small" color={THEME.primary} />
          )}
        </View>
      </View>

      {searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={(movie) => {}}
              isFavorite={favoriteIds.has(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ flex: 1 }}
          contentContainerStyle={{ padding: 8 }}
          ListEmptyComponent={
            !isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-textMuted">No results found</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Search size={48} color={THEME.textMuted} />
          <Text className="text-textMuted mt-4">
            Start searching for movies and shows
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
