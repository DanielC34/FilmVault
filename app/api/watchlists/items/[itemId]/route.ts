import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
    const { itemId } = await getParam(context);
    const userId = getUserId(req);
    await connectDB();
    const session = await mongoose.startSession();
    let item: any;

    try {
        await session.withTransaction(async () => {
            item = await WatchlistItem.findById(itemId).session(session);
            if (!item) {
                throw new Error('Item not found');
            }

            const newWatchedStatus = !item.is_watched;

            if (newWatchedStatus) {
                // MARKING AS WATCHED: Remove from all non-watched lists, add to watched list

                let watchedList = await Watchlist.findOne({
                    user_id: userId,
                    title: 'Watched'
                }).session(session);

                if (!watchedList) {
                    watchedList = await Watchlist.create([{
                        user_id: userId,
                        title: 'Watched',
                        description: 'A complete record of your cinematic journey.',
                        is_system_list: true
                    }], { session });
                    watchedList = watchedList[0];
                }

                const itemsToRemove = await WatchlistItem.find({
                    media_id: item.media_id,
                    media_type: item.media_type
                }).populate('watchlist_id').session(session);

                const watchlistsToUpdate = [];

                for (const itemToRemove of itemsToRemove) {
                    if (itemToRemove.watchlist_id.title !== 'Already Watched') {
                        await WatchlistItem.findByIdAndDelete(itemToRemove._id).session(session);
                        watchlistsToUpdate.push(itemToRemove.watchlist_id._id);
                    }
                }

                for (const watchlistId of watchlistsToUpdate) {
                    await Watchlist.findByIdAndUpdate(
                        watchlistId,
                        { $inc: { item_count: -1 } },
                        { session }
                    );
                }

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
                await WatchlistItem.findByIdAndUpdate(
                    itemId,
                    { is_watched: false },
                    { session }
                );
            }
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            is_watched: !item.is_watched,
            message: !item.is_watched ? 'Item moved to watched list and removed from other watchlists' : 'Item unmarked as watched'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    } finally {
        await session.endSession();
    }
}
