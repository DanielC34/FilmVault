import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User.js';
import { apiError } from '@/lib/apiError';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

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
        return apiError(error);
    }
}
