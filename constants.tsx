
import React from 'react';
import { 
  Film, 
  Tv, 
  TrendingUp, 
  Star, 
  Plus, 
  Search, 
  List, 
  User, 
  ChevronRight,
  MoreVertical,
  Trash2,
  Heart,
  Sparkles,
  X,
  Check,
  Eye
} from 'lucide-react';

export const THEME = {
  background: '#14181c',
  surface: '#1a2128',
  primary: '#00e054', // Letterboxd green
  accent: '#ff8000', // Letterboxd orange
  text: '#ffffff',
  textMuted: '#9ab',
};

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

export const ICONS = {
  Film: <Film size={20} />,
  Tv: <Tv size={20} />,
  Trending: <TrendingUp size={20} />,
  Star: <Star size={20} fill="#ff8000" color="#ff8000" />,
  Plus: <Plus size={24} />,
  Search: <Search size={24} />,
  List: <List size={24} />,
  User: <User size={24} />,
  ChevronRight: <ChevronRight size={20} />,
  More: <MoreVertical size={20} />,
  Trash: <Trash2 size={20} />,
  Heart: <Heart size={20} />,
  Sparkles: <Sparkles size={16} />,
  X: <X size={16} />,
  Check: <Check size={16} />,
  Eye: <Eye size={16} />
};
