const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const uri = process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_URL;

const initDb = async () => {
    if (_db) {
        console.log('Database is already initialized!');
        return;
    }
    try {
        const client = await MongoClient.connect(uri);
        _db = client.db('Project2');
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized');
    }
    return _db;
};

module.exports = {
    initDb,
    getDb
};