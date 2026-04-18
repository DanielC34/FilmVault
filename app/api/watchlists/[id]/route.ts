import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import { getParam } from '@/lib/routeParams';
import Watchlist from '@/lib/models/Watchlist.js';
import WatchlistItem from '@/lib/models/WatchlistItem.js';
import { apiError } from '@/lib/apiError';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await getParam(context);
        const userId = getUserId(req);
        await connectDB();

        const watchlist = await Watchlist.findOne({ _id: id, user_id: userId });

        if (!watchlist) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (watchlist.is_system_list) {
            return NextResponse.json({ error: 'Cannot delete system list' }, { status: 403 });
        }

        await WatchlistItem.deleteMany({ watchlist_id: id });
        await watchlist.deleteOne();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return apiError(error);
    }
}
