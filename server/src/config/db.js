import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan_saathi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if no local MongoDB instance
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`! MongoDB Connection Notice: Could not connect to MongoDB at "${uri}".`);
    console.warn(`  Operating with graceful in-memory local fallback. Set a valid MONGODB_URI in server/.env when ready.`);
    return false;
  }
}
