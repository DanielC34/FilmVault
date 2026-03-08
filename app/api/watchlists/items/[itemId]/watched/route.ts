import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import { getParam } from '@/lib/routeParams';
import Watchlist from '@/lib/models/Watchlist.js';
import WatchlistItem from '@/lib/models/WatchlistItem.js';

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await getParam(context);
        const userId = getUserId(req);
        await connectDB();

        const session = await mongoose.startSession();
        let updatedItem: any;

        try {
            await session.withTransaction(async () => {
                // 1. Find the item
                const item = await WatchlistItem.findById(itemId).session(session);
                if (!item) {
                    throw new Error('Item not found');
                }

                // 2. Find or create "Watched" system list
                let watchedList = await Watchlist.findOne({
                    user_id: userId,
                    title: 'Watched'
                }).session(session);

                if (!watchedList) {
                    const result = await Watchlist.create([{
                        user_id: userId,
                        title: 'Watched',
                        description: 'Movies and shows you have already seen.',
                        is_system_list: true
                    }], { session });
                    watchedList = result[0];
                }

                // If already in Watched list, just set is_watched to true (though it should be)
                if (item.watchlist_id.toString() === watchedList._id.toString()) {
                    item.is_watched = true;
                    await item.save({ session });
                    updatedItem = item;
                    return;
                }

                // 3. Move the item: Update watchlist_id and is_watched
                const oldWatchlistId = item.watchlist_id;

                // Check if this media is already in the Watched list
                const existingInWatched = await WatchlistItem.findOne({
                    watchlist_id: watchedList._id,
                    media_id: item.media_id
                }).session(session);

                if (existingInWatched) {
                    // media already in Watched list, delete this one and update count of old list
                    await WatchlistItem.findByIdAndDelete(itemId).session(session);
                    await Watchlist.findByIdAndUpdate(oldWatchlistId, { $inc: { item_count: -1 } }).session(session);
                    updatedItem = existingInWatched;
                } else {
                    // Update current item
                    item.watchlist_id = watchedList._id;
                    item.is_watched = true;
                    await item.save({ session });

                    // Update counts
                    await Watchlist.findByIdAndUpdate(oldWatchlistId, { $inc: { item_count: -1 } }).session(session);
                    await Watchlist.findByIdAndUpdate(watchedList._id, { $inc: { item_count: 1 } }).session(session);
                    updatedItem = item;
                }
            });

            return NextResponse.json(updatedItem);
        } finally {
            await session.endSession();
        }
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}
