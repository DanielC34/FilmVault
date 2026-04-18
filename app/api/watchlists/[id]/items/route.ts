import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import { getParam } from '@/lib/routeParams';
import Watchlist from '@/lib/models/Watchlist.js';
import WatchlistItem from '@/lib/models/WatchlistItem.js';
import { apiError } from '@/lib/apiError';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await getParam(context);
        getUserId(req); // Validate token
        await connectDB();

        const items = await WatchlistItem.find({ watchlist_id: id });

        return NextResponse.json(items.map(i => ({
            id: i._id,
            watchlist_id: i.watchlist_id,
            media_id: i.media_id,
            media_type: i.media_type,
            title: i.title,
            poster_path: i.poster_path,
            is_watched: i.is_watched,
            added_at: i.createdAt
        })));
    } catch (error: any) {
        return apiError(error);
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await getParam(context);
        getUserId(req); // Validate token
        const { media_id, media_type, title, poster_path } = await req.json();
        await connectDB();

        const item = await WatchlistItem.create({
            watchlist_id: id,
            media_id,
            media_type,
            title,
            poster_path
        });

        await Watchlist.findByIdAndUpdate(id, { $inc: { item_count: 1 } });

        return NextResponse.json({
            id: item._id,
            watchlist_id: item.watchlist_id,
            media_id: item.media_id,
            media_type: item.media_type,
            title: item.title,
            poster_path: item.poster_path,
            is_watched: false,
            added_at: item.createdAt
        });
    } catch (error: any) {
        return apiError(error);
    }
}
