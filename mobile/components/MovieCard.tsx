import React, { useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { Heart } from "lucide-react-native";
import { Movie } from "../types";
import {
  THEME,
  TMDB_IMAGE_BASE,
  POSTER_SIZE,
  SPACING,
  BORDER_RADIUS,
} from "../constants";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: MovieCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${movie.poster_path}`
    : null;

  return (
    <Pressable
      onPress={() => onPress(movie)}
      className="flex-1 mx-2 mb-4"
      style={{ minHeight: 300 }}
    >
      <View className="rounded-lg overflow-hidden bg-surface relative">
        {posterUrl ? (
          <>
            {imageLoading && (
              <View className="absolute inset-0 flex items-center justify-center bg-surface">
                <ActivityIndicator size="large" color={THEME.primary} />
              </View>
            )}
            <Image
              source={{ uri: posterUrl }}
              style={{ width: "100%", height: 280 }}
              onLoadEnd={() => setImageLoading(false)}
            />
          </>
        ) : (
          <View className="w-full h-72 bg-surface flex items-center justify-center">
            <Text className="text-textMuted text-center px-4">No Image</Text>
          </View>
        )}

        {/* Favorite Button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(movie);
          }}
          className="absolute top-2 right-2 bg-black/40 rounded-full p-2"
        >
          <Heart
            size={20}
            color={isFavorite ? THEME.accent : THEME.text}
            fill={isFavorite ? THEME.accent : "none"}
          />
        </Pressable>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <View className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1">
            <Text className="text-accent font-bold text-sm">
              ⭐ {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text className="text-white font-semibold mt-2 text-sm" numberOfLines={2}>
        {movie.title}
      </Text>

      {/* Release Date */}
      {movie.release_date && (
        <Text className="text-textMuted text-xs mt-1">
          {new Date(movie.release_date).getFullYear()}
        </Text>
      )}
    </Pressable>
  );
}
