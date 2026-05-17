
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'filmvault';

async function test() {
    console.log('Testing connection to:', MONGODB_URI);
    console.log('Using DB Name:', DB_NAME);
    
    if (!MONGODB_URI) {
        console.error('ERROR: MONGODB_URI is not defined in environment');
        process.exit(1);
    }
    
    try {
        const opts = {
            bufferCommands: true,
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 10000 
        };
        
        await mongoose.connect(MONGODB_URI, opts);
        console.log('SUCCESS: Connected to MongoDB');
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        process.exit(0);
    } catch (e) {
        console.error('FAILURE: Could not connect to MongoDB');
        console.error('Error Name:', e.name);
        console.error('Error Message:', e.message);
        if (e.reason) {
            console.error('Reason:', JSON.stringify(e.reason, null, 2));
        }
        process.exit(1);
    }
}

test();
