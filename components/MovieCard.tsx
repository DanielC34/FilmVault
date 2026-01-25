
import React from 'react';
import { Movie } from '../types';
import { ICONS, TMDB_IMAGE_BASE, POSTER_SIZE } from '../constants';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const posterUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <button 
      onClick={() => onClick(movie)}
      className="group relative flex flex-col gap-2 text-left focus:outline-none"
    >
      <div className="aspect-[2/3] w-full rounded-lg overflow-hidden relative shadow-lg bg-[#2c343c]">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e: any) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold">
          {ICONS.Star}
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
        </div>
        {movie.media_type === 'tv' && (
          <div className="absolute top-2 left-2 bg-[#00e054] text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
            TV
          </div>
        )}
      </div>
      <div className="px-0.5">
        <h3 className="text-xs font-bold truncate text-white/90 group-hover:text-white transition-colors">{movie.title}</h3>
        <p className="text-[10px] text-white/40 font-medium">
          {movie.release_date ? movie.release_date.substring(0, 4) : 'TBA'}
        </p>
      </div>
    </button>
  );
};

export default MovieCard;
