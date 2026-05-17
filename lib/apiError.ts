import { NextResponse } from 'next/server';

/** Known client-facing error messages that warrant a 4xx response. */
const CLIENT_ERRORS: Record<string, number> = {
    'Email and password are required': 400,
    'User already exists': 400,
    'Invalid credentials': 401,
    'No token provided': 401,
    'Invalid token': 401,
    'Invalid token payload': 401,
    'User not found': 404,
    'Item not found': 404,
    'Watchlist not found': 404,
};

/**
 * Returns a structured JSON error response with the correct HTTP status.
 * - Auth/validation errors → 4xx
 * - DB connection failures or unexpected errors → 500 (with a safe message)
 */
export function apiError(error: any): NextResponse {
    const message: string = error?.message ?? 'Unknown error';

    // Explicit client error
    if (CLIENT_ERRORS[message]) {
        return NextResponse.json({ error: message }, { status: CLIENT_ERRORS[message] });
    }

    // MongoDB connection failures → 503 Service Unavailable
    if (
        message.includes('ECONNREFUSED') || 
        message.includes('MongoNetworkError') || 
        message.includes('connect') ||
        message.includes('ServerSelectionError')
    ) {
        console.error('[DB] Connection failed:', message);
        const isWhitelistError = message.includes('ServerSelectionError') || message.includes('timeout');
        return NextResponse.json(
            { 
                error: isWhitelistError 
                    ? 'Database connection timeout. Please ensure your IP is whitelisted in MongoDB Atlas.' 
                    : 'Database unavailable. Please try again shortly.' 
            },
            { status: 503 }
        );
    }

    // Unexpected server-side error → 500
    console.error('[API] Unhandled error:', message);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
}
