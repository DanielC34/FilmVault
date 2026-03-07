import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserId } from '@/lib/auth';
import Watchlist from '@/lib/models/Watchlist.js';

export async function GET(req: Request) {
    try {
        const userId = getUserId(req);
        await connectDB();

        const watchlists = await Watchlist.find({ user_id: userId });

        return NextResponse.json(watchlists.map(w => ({
            id: w._id,
            user_id: w.user_id,
            title: w.title,
            description: w.description,
            is_system_list: w.is_system_list,
            item_count: w.item_count,
            created_at: w.createdAt
        })));
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}

export async function POST(req: Request) {
    try {
        const userId = getUserId(req);
        const { title, description } = await req.json();
        await connectDB();

        const watchlist = await Watchlist.create({ user_id: userId, title, description });

        return NextResponse.json({
            id: watchlist._id,
            user_id: watchlist.user_id,
            title: watchlist.title,
            description: watchlist.description,
            is_system_list: false,
            item_count: 0,
            created_at: watchlist.createdAt
        });
    } catch (error: any) {
        const status = error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}
