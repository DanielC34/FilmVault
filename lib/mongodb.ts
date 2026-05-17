import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'filmvault';

if (!MONGODB_URI) {
    throw new Error('[DB] Please define the MONGODB_URI environment variable inside .env or .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // 1. Ensure MONGODB_URI is validated before use
    if (!process.env.MONGODB_URI) {
        const err = new Error('[DB] MONGODB_URI environment variable is missing.');
        console.error('[DB] Connection failed with full error:', err);
        throw err;
    }

    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        const opts = {
            bufferCommands: true,
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 10000,
        };

        // 2. Clear logging: Attempting connection
        console.log('[DB] Attempting connection');
        cached!.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    }

    try {
        // 3. Ensure mongoose.connect is properly awaited
        cached!.conn = await cached!.promise;
        // 4. Clear logging: Connected successfully
        console.log('[DB] Connected successfully');
    } catch (e: any) {
        // 5. Clear logging: Connection failed with full error & do NOT hide stack trace
        console.error('[DB] Connection failed with full error:', e);
        cached!.promise = null; // Reset promise so subsequent requests can retry
        throw e;
    }

    return cached!.conn;
}

export default connectDB;
export { connectDB };
