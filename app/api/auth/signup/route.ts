import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User.js';
import Watchlist from '@/lib/models/Watchlist.js';
import { apiError } from '@/lib/apiError';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        console.log('[Signup API] HIT');
        await connectDB();
        console.log('[Signup API] DB CONNECTED');
        
        const body = await req.json();
        const { email, password } = body;
        console.log(`[Signup API] Attempting signup for: ${email}`);

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0];

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn(`[Signup API] Signup blocked: User ${email} already exists.`);
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = await User.create({
            email,
            password: hashedPassword,
            username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        });

        console.log(`[Signup API] User created successfully: ${user._id}. Initializing default vaults...`);

        await Watchlist.insertMany([
            {
                user_id: user._id,
                title: 'Favorites',
                description: 'Your top-tier cinematic picks.',
                is_system_list: true
            },
            {
                user_id: user._id,
                title: 'Watched',
                description: 'Movies and shows you have already seen.',
                is_system_list: true
            }
        ]);

        console.log(`[Signup API] Vaults created. Signing token...`);

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
        console.error('[Signup API] ERROR', error);
        return NextResponse.json(
            { error: 'Internal server error or database connection failed.' }, 
            { status: 500 }
        );
    }
}
