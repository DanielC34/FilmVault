import React from "react";
import {
  Film,
  Tv,
  TrendingUp,
  Star,
  Plus,
  Search,
  List,
  User,
  Heart,
  Sparkles,
  Trash2,
  Check,
  Eye,
  ChevronRight,
} from "lucide-react-native";

export const THEME = {
  background: "#14181c",
  surface: "#1a2128",
  primary: "#00e054",
  accent: "#ff8000",
  text: "#ffffff",
  textMuted: "#9ab",
  error: "#ff6b6b",
  success: "#51cf66",
};

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const POSTER_SIZE = "/w342";
export const BACKDROP_SIZE = "/w780";

export const ICONS = {
  Film: <Film size={24} color={THEME.primary} />,
  Tv: <Tv size={24} color={THEME.primary} />,
  TrendingUp: <TrendingUp size={24} color={THEME.primary} />,
  Star: <Star size={24} color={THEME.accent} />,
  Plus: <Plus size={24} color={THEME.primary} />,
  Search: <Search size={24} color={THEME.text} />,
  List: <List size={24} color={THEME.primary} />,
  User: <User size={24} color={THEME.primary} />,
  Heart: <Heart size={24} color={THEME.accent} />,
  HeartFilled: <Heart size={24} color={THEME.accent} fill={THEME.accent} />,
  Sparkles: <Sparkles size={24} color={THEME.accent} />,
  Trash2: <Trash2 size={24} color={THEME.error} />,
  Check: <Check size={24} color={THEME.success} />,
  Eye: <Eye size={24} color={THEME.text} />,
  ChevronRight: <ChevronRight size={24} color={THEME.text} />,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};
