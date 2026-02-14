import express from 'express';
import User from '../models/User.js';
import Watchlist from '../models/Watchlist.js';
import WatchlistItem from '../models/WatchlistItem.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const watchlists = await Watchlist.find({ user_id: req.userId });
    const watchedList = watchlists.find(w => w.title === 'Already Watched');
    
    let totalItems = 0;
    let watchedItems = 0;

    for (const watchlist of watchlists) {
      totalItems += watchlist.item_count || 0;
    }

    if (watchedList) {
      const watchedListItems = await WatchlistItem.find({ watchlist_id: watchedList._id });
      watchedItems = watchedListItems.length;
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      createdAt: user.createdAt,
      watchlistsCount: watchlists.length,
      totalItems,
      watchedItems
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;