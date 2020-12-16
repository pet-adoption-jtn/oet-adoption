const { MongoClient, ObjectID } = require('mongodb')
const init = require('./db-setup')
const uri = 'mongodb+srv://torian:torian05092002@cluster0.agovw.mongodb.net/?retryWrites=true&w=majority'

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