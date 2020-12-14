const { MongoClient, ObjectID } = require('mongodb')
const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useUnifiedTopology: true })

const connect = async () => await client.connect()
connect()

let db;

if (process.env.NODE_ENV === 'development') {
  db = client.db('adopt-us')
} else {
  db = client.db('adopt-us-testing')
}


module.exports = {
  db,
  ObjectID
}