const dotenv = require('dotenv')
dotenv.config()
const MongoClient = require('mongodb').MongoClient
const uri = process.env.MONGO_URI

let database

const initDb = (callback) => {
    if (database) {
        console.log('Database is already connected')
        return callback(null, database)
        }
        MongoClient.connect(uri)
            .then((client) => {
                database = client
                callback(null, database)
            })
            .catch((err) => {
                callback(err)
            })
}

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized')
    }
    return database
}

module.exports = {
    initDb,
    getDatabase
}