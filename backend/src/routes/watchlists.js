import express from 'express';
import mongoose from 'mongoose';
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
  const session = await mongoose.startSession();
  let item;
  
  try {
    await session.withTransaction(async () => {
      item = await WatchlistItem.findById(req.params.itemId).session(session);
      if (!item) {
        throw new Error('Item not found');
      }

      const newWatchedStatus = !item.is_watched;
      
      if (newWatchedStatus) {
        // MARKING AS WATCHED: Remove from all non-watched lists, add to watched list
        
        // 1. Find or create the "Already Watched" system list
        let watchedList = await Watchlist.findOne({ 
          user_id: req.userId, 
          title: 'Already Watched' 
        }).session(session);
        
        if (!watchedList) {
          watchedList = await Watchlist.create([{
            user_id: req.userId,
            title: 'Already Watched',
            description: 'A complete record of your cinematic journey.',
            is_system_list: true
          }], { session });
          watchedList = watchedList[0];
        }
        
        // 2. Remove item from ALL non-watched watchlists (including current one)
        const itemsToRemove = await WatchlistItem.find({
          media_id: item.media_id,
          media_type: item.media_type
        }).populate('watchlist_id').session(session);
        
        const watchlistsToUpdate = [];
        
        for (const itemToRemove of itemsToRemove) {
          // Only remove from non-watched lists (not the "Already Watched" list)
          if (itemToRemove.watchlist_id.title !== 'Already Watched') {
            await WatchlistItem.findByIdAndDelete(itemToRemove._id).session(session);
            watchlistsToUpdate.push(itemToRemove.watchlist_id._id);
          }
        }
        
        // 3. Update item counts for affected watchlists
        for (const watchlistId of watchlistsToUpdate) {
          await Watchlist.findByIdAndUpdate(
            watchlistId,
            { $inc: { item_count: -1 } },
            { session }
          );
        }
        
        // 4. Add to "Already Watched" list (if not already there)
        const existsInWatched = await WatchlistItem.findOne({
          watchlist_id: watchedList._id,
          media_id: item.media_id,
          media_type: item.media_type
        }).session(session);
        
        if (!existsInWatched) {
          await WatchlistItem.create([{
            watchlist_id: watchedList._id,
            media_id: item.media_id,
            media_type: item.media_type,
            title: item.title,
            poster_path: item.poster_path,
            is_watched: true
          }], { session });
          
          await Watchlist.findByIdAndUpdate(
            watchedList._id,
            { $inc: { item_count: 1 } },
            { session }
          );
        }
        
      } else {
        // UNMARKING AS WATCHED: Just update the current item
        await WatchlistItem.findByIdAndUpdate(
          req.params.itemId,
          { is_watched: false },
          { session }
        );
      }
    });
    
    res.json({ 
      success: true, 
      is_watched: !item.is_watched,
      message: !item.is_watched ? 'Item moved to watched list and removed from other watchlists' : 'Item unmarked as watched'
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await session.endSession();
  }
});

export default router;
