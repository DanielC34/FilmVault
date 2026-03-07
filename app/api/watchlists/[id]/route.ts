import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import Watchlist from '@/lib/models/Watchlist.js';
import WatchlistItem from '@/lib/models/WatchlistItem.js';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = getUserId(req);
        await connectDB();

        const watchlist = await Watchlist.findOne({ _id: params.id, user_id: userId });

        if (!watchlist) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (watchlist.is_system_list) {
            return NextResponse.json({ error: 'Cannot delete system list' }, { status: 403 });
        }

        await WatchlistItem.deleteMany({ watchlist_id: params.id });
        await watchlist.deleteOne();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}
