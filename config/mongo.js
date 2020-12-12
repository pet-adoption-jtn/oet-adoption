const { MongoClient, ObjectID } = require('mongodb')

const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useUnifiedTopology: true })

const connect = async () => await client.connect()
connect()

// const db = client.db('adopt-us')
const db = client.db('favorites-test')

module.exports = {
  db,
  ObjectID
}







