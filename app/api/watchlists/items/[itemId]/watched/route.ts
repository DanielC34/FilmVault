import { NextRequest, NextResponse } from 'next/server';
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

        // 1. Find the item
        const item = await WatchlistItem.findById(itemId);
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // 2. Find or create "Watched" system list
        let watchedList = await Watchlist.findOne({
            user_id: userId,
            title: 'Watched'
        });

        if (!watchedList) {
            watchedList = await Watchlist.create({
                user_id: userId,
                title: 'Watched',
                description: 'Movies and shows you have already seen.',
                is_system_list: true
            });
        }

        // If already in Watched list, just set is_watched to true (though it should be)
        if (item.watchlist_id.toString() === watchedList._id.toString()) {
            item.is_watched = true;
            await item.save();
            return NextResponse.json(item);
        }

        // 3. Move the item: Update watchlist_id and is_watched
        const oldWatchlistId = item.watchlist_id;

        // Check if this media is already in the Watched list
        const existingInWatched = await WatchlistItem.findOne({
            watchlist_id: watchedList._id,
            media_id: item.media_id
        });

        if (existingInWatched) {
            // media already in Watched list, delete this one and update count of old list
            await WatchlistItem.findByIdAndDelete(itemId);
            await Watchlist.findByIdAndUpdate(oldWatchlistId, { $inc: { item_count: -1 } });
            return NextResponse.json(existingInWatched);
        } else {
            // Update current item
            item.watchlist_id = watchedList._id;
            item.is_watched = true;
            await item.save();

            // Update counts sequentially
            await Watchlist.findByIdAndUpdate(oldWatchlistId, { $inc: { item_count: -1 } });
            await Watchlist.findByIdAndUpdate(watchedList._id, { $inc: { item_count: 1 } });
            return NextResponse.json(item);
        }
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}
