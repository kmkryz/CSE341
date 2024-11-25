const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const connectionString = process.env.MONGODB_URI;

let db;

const initDb = async () => {
  if (db) {
    console.warn('Database is already initialized!');
    return db;
  }
  try {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db();
    console.log('Database initialized');
    return db;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = { initDb, getDb };