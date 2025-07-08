// backend/db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  w: 'majority'
});
let dbInstance = null;

const connectToDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await client.connect();
      console.log('MongoDB client connected successfully');
      dbInstance = client.db(process.env.DB_NAME || "crop_yield_db");
      return dbInstance;
    } catch (err) {
      retryCount++;
      console.error(`Failed to connect to MongoDB (Attempt ${retryCount}/${maxRetries}):`, err.message);
      
      if (retryCount === maxRetries) {
        console.error('Max retries reached. Could not connect to MongoDB');
        throw err;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
};

module.exports = connectToDatabase;