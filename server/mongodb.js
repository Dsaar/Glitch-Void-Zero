import { MongoClient } from 'mongodb';

let collectionPromise;

export async function getScoresCollection() {
  if (!collectionPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('YOUR_')) {
      throw new Error('Set MONGODB_URI on the server.');
    }
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    // Let the driver read the URI database; use our default when its path is empty.
    const database = /^mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(uri)
      ? undefined
      : 'glitch_void_zero';
    collectionPromise = (async () => {
      try {
        await client.connect();
        const collection = client.db(database).collection('leaderboard');
        await collection.createIndex({ score: -1, createdAt: 1, _id: 1 });
        return collection;
      } catch (error) {
        await client.close();
        collectionPromise = undefined;
        throw error;
      }
    })();
  }
  return collectionPromise;
}
