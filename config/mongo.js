const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useUnifiedTopology: true })

const connect = () => await client.connect()
connect()

const db = client.db('adopt-us')

module.exports = {
  db
}







