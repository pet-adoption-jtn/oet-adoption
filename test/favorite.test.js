const { afterAll, beforeAll, it, expect, describe } = require('@jest/globals')
const { signToken } = require('../helpers/jwt')
const { MongoClient, ObjectID } = require('mongodb')
const { hashPassword } = require('../helpers/bcrypt')
const request = require('supertest')
const app = require('../app')

let access_token = ''
let newDataPet = {}
let db;
let connection;
let FavPets;
let CollUser;
let UserLogin;
const user_data = {
  email: 'example@mail.com',
  password: hashPassword('123456'),
  phone: '081905056936',
  address: 'jakarta',
  username: 'examspl'
}

beforeAll(async () => {
  connection = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true
  })
  db = await connection.db('adopt-us')
  FavPets = db.collection('Favorites')
  CollUser = db.collection('Users')
  UserLogin = await CollUser.insertOne(user_data)
  newDataPet = await FavPets.insertOne({
    pet_id: ObjectID() ,
    user_id: ObjectID(UserLogin.ops[0]._id)
  })
  access_token = signToken(user_data)
})

afterAll(async () => {
  access_token = ''
  await FavPets.deleteMany({})
  await CollUser.deleteMany({})
})

describe('add Favorites pet test', () => {
  it('add favorites pet success', (done) => {
    const newPet = {
      pet_id: newDataPet.ops[0]._id
    }
    request(app)
      .post('/favorites')
      .set('access_token', access_token)
      .send(newPet)
      .then((res) => {
        const { body, status } = res

        expect(status).toEqual(200)
        expect(body).toHaveProperty('pet_id', expect.any(String))
        expect(body).toHaveProperty('user_id', expect.any(String))

        done()
      })
      .catch(done)
  })

  it('add favorites pet fail (access_token)', (done) => {
    const newPet = {
      name: 'jon',
      breed: 'wolf',
      age: 'baby',
      gender: 'male',
      color: 'black'
    }
    request(app)
      .post('/favorites')
      .set('access_token', null)
      .send(newPet)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(500)
        expect(body).toHaveProperty('message', 'jwt malformed')
        done()
      })
      .catch(done)
  })

  it('add favorites pet fail (no data)', (done) => {
    request(app)
      .post('/favorites')
      .set('access_token', access_token)
      .send(null)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(400)
        expect(body).toHaveProperty('message', 'Empty Data')
        done()
      })
      .catch(done)
  })

  it('get all Favorites pet success', (done) => {
    request(app)
      .get('/favorites')
      .set('access_token', access_token)
      .then((res) => {
        const { body, status } = res

        expect(status).toEqual(200)
        expect(body).toStrictEqual(expect.any(Array))
        done()
      })
      .catch(done)
  })

  it('delete favorite pet user success', (done) => {
    request(app)
      .delete(`/favorites/${newDataPet.ops[0]._id}`)
      .set('access_token', access_token)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(200)
        expect(body).toHaveProperty('msg', 'Successfully deleted one Pet Favorites.')
        done()
      })
      .catch(done)
  })
})