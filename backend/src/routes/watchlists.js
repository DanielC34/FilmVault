import express from 'express';
import Watchlist from '../models/Watchlist.js';
import WatchlistItem from '../models/WatchlistItem.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ user_id: req.userId });
    res.json(watchlists.map(w => ({
      id: w._id,
      user_id: w.user_id,
      title: w.title,
      description: w.description,
      is_system_list: w.is_system_list,
      item_count: w.item_count,
      created_at: w.createdAt
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const watchlist = await Watchlist.create({ user_id: req.userId, title, description });
    res.json({ id: watchlist._id, user_id: watchlist.user_id, title: watchlist.title, description: watchlist.description, is_system_list: false, item_count: 0, created_at: watchlist.createdAt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ _id: req.params.id, user_id: req.userId });
    if (!watchlist) return res.status(404).json({ error: 'Not found' });
    if (watchlist.is_system_list) return res.status(403).json({ error: 'Cannot delete system list' });
    
    await WatchlistItem.deleteMany({ watchlist_id: req.params.id });
    await watchlist.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const items = await WatchlistItem.find({ watchlist_id: req.params.id });
    res.json(items.map(i => ({
      id: i._id,
      watchlist_id: i.watchlist_id,
      media_id: i.media_id,
      media_type: i.media_type,
      title: i.title,
      poster_path: i.poster_path,
      is_watched: i.is_watched,
      added_at: i.createdAt
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/items', async (req, res) => {
  try {
    const { media_id, media_type, title, poster_path } = req.body;
    const item = await WatchlistItem.create({
      watchlist_id: req.params.id,
      media_id,
      media_type,
      title,
      poster_path
    });
    await Watchlist.findByIdAndUpdate(req.params.id, { $inc: { item_count: 1 } });
    res.json({ id: item._id, watchlist_id: item.watchlist_id, media_id: item.media_id, media_type: item.media_type, title: item.title, poster_path: item.poster_path, is_watched: false, added_at: item.createdAt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/items/:itemId', async (req, res) => {
  try {
    const item = await WatchlistItem.findByIdAndDelete(req.params.itemId);
    if (item) {
      await Watchlist.findByIdAndUpdate(item.watchlist_id, { $inc: { item_count: -1 } });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/items/:itemId/watched', async (req, res) => {
  try {
    const item = await WatchlistItem.findById(req.params.itemId);
    item.is_watched = !item.is_watched;
    await item.save();
    
    if (item.is_watched) {
      const watchedList = await Watchlist.findOne({ user_id: req.userId, title: 'Already Watched' }) ||
        await Watchlist.create({ user_id: req.userId, title: 'Already Watched', description: 'A complete record of your cinematic journey.', is_system_list: true });
      
      const exists = await WatchlistItem.findOne({ watchlist_id: watchedList._id, media_id: item.media_id });
      if (!exists) {
        await WatchlistItem.create({
          watchlist_id: watchedList._id,
          media_id: item.media_id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          is_watched: true
        });
        await Watchlist.findByIdAndUpdate(watchedList._id, { $inc: { item_count: 1 } });
      }
    }
    
    res.json({ is_watched: item.is_watched });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
