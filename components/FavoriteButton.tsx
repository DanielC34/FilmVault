
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onToggle, size = 20 }) => {
  const [isAnimate, setIsAnimate] = useState(false);

  const handlePress = () => {
    setIsAnimate(true);
    onToggle();
    setTimeout(() => setIsAnimate(false), 300);
  };

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handlePress();
      }}
      className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group active:scale-90 ${
        isFavorite 
          ? 'bg-red-500/10 border-red-500/30 text-red-500' 
          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
      }`}
    >
      <div className={`transition-transform duration-300 ${isAnimate ? 'scale-150' : 'scale-100'}`}>
        <Heart 
          size={size} 
          fill={isFavorite ? "currentColor" : "none"} 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Sparkle effects on favorite */}
      {isAnimate && isFavorite && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping delay-75" />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping delay-150" />
        </div>
      )}
    </button>
  );
};

export default FavoriteButton;
