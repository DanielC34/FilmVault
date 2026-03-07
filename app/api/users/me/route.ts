import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User.js';
import { getUserId } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await connectDB();

        let userId;
        try {
            userId = getUserId(req);
        } catch (authError: any) {
            return NextResponse.json({ error: authError.message }, { status: 401 });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
