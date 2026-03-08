import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import { getParam } from '@/lib/routeParams';
import Watchlist from '@/lib/models/Watchlist.js';
import WatchlistItem from '@/lib/models/WatchlistItem.js';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await getParam(context);
        getUserId(req); // Validate token
        await connectDB();

        const item = await WatchlistItem.findByIdAndDelete(itemId);
        if (item) {
            await Watchlist.findByIdAndUpdate(item.watchlist_id, { $inc: { item_count: -1 } });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}

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

        const newWatchedStatus = !item.is_watched;

        if (newWatchedStatus) {
            // MARKING AS WATCHED: Move from all non-watched lists, add to watched list

            let watchedList = await Watchlist.findOne({
                user_id: userId,
                title: 'Watched'
            });

            if (!watchedList) {
                watchedList = await Watchlist.create({
                    user_id: userId,
                    title: 'Watched',
                    description: 'A complete record of your cinematic journey.',
                    is_system_list: true
                });
            }

            // Find all items for this media in non-"Watched" lists
            const itemsToRemove = await WatchlistItem.find({
                media_id: item.media_id,
                media_type: item.media_type
            }).populate('watchlist_id');

            const watchlistsToUpdate = [];

            for (const itemToRemove of itemsToRemove) {
                if (itemToRemove.watchlist_id.title !== 'Watched') {
                    await WatchlistItem.findByIdAndDelete(itemToRemove._id);
                    watchlistsToUpdate.push(itemToRemove.watchlist_id._id);
                }
            }

            // Decrement counts for each list we removed the item from
            for (const watchlistId of watchlistsToUpdate) {
                await Watchlist.findByIdAndUpdate(
                    watchlistId,
                    { $inc: { item_count: -1 } }
                );
            }

            // Check if already exists in Watched list
            const existsInWatched = await WatchlistItem.findOne({
                watchlist_id: watchedList._id,
                media_id: item.media_id,
                media_type: item.media_type
            });

            if (!existsInWatched) {
                await WatchlistItem.create({
                    watchlist_id: watchedList._id,
                    media_id: item.media_id,
                    media_type: item.media_type,
                    title: item.title,
                    poster_path: item.poster_path,
                    is_watched: true
                });

                await Watchlist.findByIdAndUpdate(
                    watchedList._id,
                    { $inc: { item_count: 1 } }
                );
            }

        } else {
            // UNMARKING AS WATCHED: Just set is_watched to false
            // Note: In this specific app logic, "unmarking" might be simpler, 
            // but for consistency we just update the field.
            await WatchlistItem.findByIdAndUpdate(
                itemId,
                { is_watched: false }
            );
        }

        return NextResponse.json({
            success: true,
            is_watched: newWatchedStatus,
            message: newWatchedStatus ? 'Item moved to watched list and removed from other watchlists' : 'Item unmarked as watched'
        });

    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}
