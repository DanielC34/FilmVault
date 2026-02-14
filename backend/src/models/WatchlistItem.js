import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema({
  watchlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Watchlist', required: true },
  media_id: { type: String, required: true },
  media_type: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true },
  poster_path: { type: String, default: '' },
  is_watched: { type: Boolean, default: false }
}, { timestamps: true });

watchlistItemSchema.index({ watchlist_id: 1, media_id: 1 }, { unique: true });

export default mongoose.model('WatchlistItem', watchlistItemSchema);
