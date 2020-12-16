const { MongoClient, ObjectID } = require('mongodb')
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useUnifiedTopology: true })

let db;

const connect = cb => {
  client.connect(err => {
    if (err) {
      console.log('connection failed');
    } else {
      console.log('connected');
      db = client.db('adopt-us')
    }
    cb(err)
  })
}

const getDatabase = () => {
  if (db) return db
}

module.exports = {
  ObjectID,
  connect,
  getDatabase
}