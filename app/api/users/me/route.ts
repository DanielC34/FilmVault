import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User.js';
import { getUserId } from '@/lib/auth';
import { apiError } from '@/lib/apiError';

export async function GET(req: Request) {
    try {
        const userId = getUserId(req);
        await connectDB();

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return apiError(error);
    }
}
