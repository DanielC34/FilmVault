import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  is_system_list: { type: Boolean, default: false },
  item_count: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Watchlist', watchlistSchema);
