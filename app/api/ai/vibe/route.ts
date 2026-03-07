import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
    try {
        const { titles } = await req.json();

        if (!titles || !Array.isArray(titles)) {
            return NextResponse.json({ error: 'titles array is required' }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Based on this watchlist: ${titles.join(', ')}, describe the "vibe" of this movie fan in two sentences. Start with "The Vibe:".`,
        });

        return NextResponse.json({
            text: response.text || 'The Vibe: Eclectic and adventurous with a taste for visual storytelling.',
        });
    } catch (error: any) {
        console.error('Gemini vibe error:', error);
        return NextResponse.json(
            { text: 'The Vibe: A dedicated cinephile building a legacy collection.' },
            { status: 200 },
        );
    }
}
