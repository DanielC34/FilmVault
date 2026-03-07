import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
    try {
        const { movieTitle } = await req.json();

        if (!movieTitle) {
            return NextResponse.json({ error: 'movieTitle is required' }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Provide a one-sentence "cinephile hot take" on why a movie fan must watch "${movieTitle}". Keep it professional but edgy, like a Criterion Collection essay snippet.`,
        });

        return NextResponse.json({ text: response.text || 'A modern masterpiece that defies convention.' });
    } catch (error: any) {
        console.error('Gemini insight error:', error);
        return NextResponse.json(
            { text: 'An essential piece of cinematic history.' },
            { status: 200 },
        );
    }
}
