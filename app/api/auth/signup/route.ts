import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User.js';
import Watchlist from '@/lib/models/Watchlist.js';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0];

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = await User.create({
            email,
            password: hashedPassword,
            username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        });

        await Watchlist.create({
            user_id: user._id,
            title: 'Favorites',
            description: 'Your top-tier cinematic picks.',
            is_system_list: true
        });

        const token = signToken({ userId: user._id });

        return NextResponse.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                avatar_url: user.avatar_url
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
