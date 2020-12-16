const { afterAll, beforeAll, it, expect, describe } = require('@jest/globals');
const { signToken } = require('../helpers/jwt')
const { ObjectID } = require('mongodb')
const { db } = require('../config/mongo')
const request = require('supertest');
const app = require('../app');

let access_token = ''
let fake_token = ''
let token2 = ''
const newPet = {
  name: 'Kora',
  breed: 'Alaskan Malamute',
  pictures: [
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/Alaskan_Malamute.jpg',
    'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/14141551/Alaskan-Malamute-puppies.jpg'
  ],
  age: 'baby',
  gender: 'male',
  color: 'white',
  type: 'dog',
  status: false,
  request: []
}
let pet;
const user_data = {
  username: 'john doe',
  email: 'john@mail.com',
  password: 'asdasdasd',
  address: 'jakarta',
  phone: '081806463153'
}
let user;
let other_user;

beforeAll(async () => {
  const users = db.collection('Users')
  const { ops } = await users.insertOne(user_data)
  const { ops: another_user } = await users.insertOne({
    username: 'account',
    email: 'account@mail.com',
    password: 'asdasdasd',
    address: 'bandung',
    phone: '081398118877'
  })
  other_user = another_user[0]
  user = ops[0]
  token2 = signToken(another_user[0])
  fake_token = signToken({
    id: '2123432',
    email: 'fake@mail.com',
    username: 'asdad'
  })

  const pets = db.collection('Pets')
  const { ops: petData } =  await pets.insertOne({ ...newPet, user_id: ObjectID(user._id)})
  pet = petData[0]
  access_token = signToken(user_data)
})

afterAll(async () => {
  await db.collection('Users').deleteMany({})
  await db.collection('Pets').deleteMany({})
  access_token = ''
})

describe('get pet lists', () => {
  it('get success', (done) => {
    request(app)
      .get('/pets')
      .then((res) => {
        const { body, status } = res
        expect(body).toStrictEqual(expect.any(Array))
        expect(status).toEqual(200)
        done()
      })
      .catch(done)
  })
  it('filter pets by query', (done) => {
    request(app)
      .get('/pets?type=dog&age=young')
      .then((res) => {
        const { body, status } = res
        expect(body).toStrictEqual(expect.any(Array))
        expect(status).toEqual(200)
        done()
      })
      .catch(done)
  })
})

describe('get pet details', () => {
  it('get details success', (done) => {
    request(app)
      .get(`/pets/detail/${pet._id}`)
      .then((res) => {
        const { body, status } = res
        expect(body).toHaveProperty('name', 'Kora')
        expect(body).toHaveProperty('breed', 'Alaskan Malamute')
        expect(body).toHaveProperty('age', 'baby')
        expect(body).toHaveProperty('gender', 'male')
        expect(body).toHaveProperty('color', 'white')
        expect(body).toHaveProperty('type', 'dog')
        expect(body).toHaveProperty('status', false)
        expect(body).toHaveProperty('request', expect.any(Array))
        expect(body).toHaveProperty('pictures', expect.any(Array))
        expect(status).toEqual(200)
        done()
      })
      .catch(done)
  })
  it('get details (id not found)', (done) => {
    request(app)
      .get(`/pets/detail/5fd08ff84860bd089c5c5369`)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(404)
        expect(body).toHaveProperty('message', 'Pet is not found')
        done()
      })
      .catch(done)
  })
})

describe('get pets by owner', () => {
  it('get by owner success', (done) => {
    request(app)
      .get('/pets/owner')
      .set('access_token', access_token)
      .then(res => {
        const { status, body } = res
        expect(status).toEqual(200)
        expect(body).toStrictEqual(expect.any(Array))
        done()
      })
      .catch(done)
  })
  it('failed response (no access_token)', (done) => {
    request(app)
      .get('/pets/owner')
      .then(res => {
        const {status, body} = res
        expect(body).toHaveProperty('message', 'Authentication Failed')
        expect(status).toEqual(401)
        done()
      })
      .catch(done)
  })
})

describe('request adoption test', () => {
  it('request success', (done) => {
    request(app)
      .post('/pets/request_adoption')
      .set('access_token', access_token)
      .send({
        pet_detail: {
          ...pet,
          Owner: user_data
        },
        form_data: {first_name: 'asdasd'},
        adopter: user_data
      })
      .then(({ status, body }) => {
        expect(status).toEqual(200)
        expect(body).toHaveProperty('message', 'Adoption form delivered to owner')
        expect(body).toHaveProperty('pet', expect.any(Object))
        done()
      })
      .catch(done)
  })
  it('request adoption failed (no access_token', (done) => {
    request(app)
      .post('/pets/request_adoption')
      .send({
        pet_detail: pet,
        form_data: {first_name: 'asdasd'},
        adopter: user_data
      })
        .then(({ status, body }) => {
          expect(status).toEqual(401)
          expect(body).toHaveProperty('message', 'Authentication Failed')
          done()
        })
        .catch(done)
  })
  it('request failed, pet not found', (done) => {
    request(app)
      .post('/pets/request_adoption')
      .set('access_token', access_token)
      .send({
        pet_detail: {
          ...pet,
          _id: "5fd08ff84860bd089c5c5369",
          Owner: user_data
        },
        form_data: {first_name: 'asdasd'},
        adopter: user_data
      })
      .then(({ status, body }) => {
        expect(status).toEqual(404)
        expect(body).toHaveProperty('message', 'Pet Not Found')
        done()
      })
      .catch(done)
  })
})

describe('add new pet tests', () => {
  it('add pet success', (done) => {
    request(app)
      .post('/pets')
      .set('access_token', access_token)
      .send({
        name: 'Bumi',
        breed: 'Pitbull',
        age: 'young',
        gender: 'female',
        color: 'grey',
        type: 'dog',
        pictures: [
          'https://images.solopos.com/2013/06/american-pitbull-terrier-dogs-by-all-puppies.com_-1200x1385.jpg'
        ]
      })
      .then((res) => {
        const { body, status } = res

        expect(status).toEqual(201)
        expect(body).toHaveProperty('name', 'Bumi')
        expect(body).toHaveProperty('breed', 'Pitbull')
        expect(body).toHaveProperty('age', 'young')
        expect(body).toHaveProperty('gender', 'female')
        expect(body).toHaveProperty('color', 'grey')
        expect(body).toHaveProperty('type', 'dog')
        expect(body).toHaveProperty('status', false)
        expect(body).toHaveProperty('request', expect.any(Array))
        expect(body).toHaveProperty('pictures', expect.any(Array))

        done()
      })
      .catch(done)
  })
  it('add pet failed (no access_token)', (done) => {
    request(app)
      .post('/pets')
      .send(newPet)
      .then((res) => {
        const { body, status } = res
        expect(body).toHaveProperty('message', 'Authentication Failed')
        expect(status).toEqual(401)
        done()
      })
      .catch(done)
  })
  it('add pet failed(no data)', (done) => {
    request(app)
      .post('/pets')
      .set('access_token', access_token)
      .then(res => {
        const { body, status } = res
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Validation Error')
        done()
      })
      .catch(done)
  })
  it('add pet failed, (auth fail, user not in db)', (done) => {
    request(app)
      .post('/pets')
      .set('access_token', fake_token)
      .send(newPet)
      .then(({ body, status }) => {
        expect(body).toHaveProperty('message', 'Authentication Failed')
        expect(status).toEqual(401)
        done()
      })
      .catch(done)
  })
})

describe('update pet tests', () => {
  it('update pet success', (done) => {
    request(app)
    .put(`/pets/${pet._id}`)
    .send({
      ...newPet,
      name: 'updated',
      age: 'adult'
    })
    .set('access_token', access_token)
    .then((res) => {
      const { status, body } = res

      expect(status).toEqual(200)
      expect(body).toHaveProperty('name', 'updated')
      expect(body).toHaveProperty('breed', 'Alaskan Malamute')
      expect(body).toHaveProperty('age', 'adult')
      expect(body).toHaveProperty('gender', 'male')
      expect(body).toHaveProperty('color', 'white')

      done()
    })
    .catch(done)
  })
  it('update pet failed (pet not found)', (done) => {
    request(app)
      .put(`/pets/5fd08ff84860bd089c5c5369`)
      .send(newPet)
      .set('access_token', access_token)
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(404)
        expect(body).toHaveProperty('message', 'Pet is not found')
        done()
      })
      .catch(done)
  })
  it('update pet failed (not logged in)', (done) => {
    request(app)
      .put(`/pets/${pet._id}`)
      .send(newPet)
      .then((res) => {
        const { status, body } = res
        expect(body).toHaveProperty('message', 'Authentication Failed')
        expect(status).toEqual(401)
        done()
      })
      .catch(done)
  })
  it('update pet failed (no data)', (done) => {
    request(app)
    .put(`/pets/${pet._id}`)
    .set('access_token', access_token)
    .send({})
    .then(res => {
      const { body, status } = res
      expect(status).toEqual(401)
      expect(body).toHaveProperty('message', 'Validation Error')
      done()
    })
    .catch(done)
  })
  it('update failed (pet doenst belong to user)', (done) => {
    request(app)
      .put(`/pets/${pet._id}`)
      .set('access_token', token2)
      .send(newPet)
      .then(({ status, body }) => {
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Not Authorized')
        done()
      })
      .catch(done)
  })
})

describe('adopt pet tests', () => {
  it('adopt successfull', (done) => {
    request(app)
      .patch(`/pets/${pet._id}`)
      .set('access_token', access_token)
      .send({
        status: true,
        adopter: user_data,
        pet: pet
      })
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(200)
        expect(body).toHaveProperty('message', 'Adoption Successfull')
        done()
      })
      .catch(done)
  })
  it('adopt canceled', (done) => {
    request(app)
      .patch(`/pets/${pet._id}`)
      .set('access_token', access_token)
      .send({
        status: false,
        adopter: user_data,
        pet: pet
      })
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(200)
        expect(body).toHaveProperty('message', 'Adoption Canceled')
        done()
      })
      .catch(done)
  })
  it('adopt failed (pet not found)', (done) => {
    request(app)
      .patch('/pets/5fd08ff84860bd089c5c5369')
      .set('access_token', access_token)
      .send({
        status: true,
        adopter: user_data
      })
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(404)
        expect(body).toHaveProperty('message', 'Pet is not found')
        done()
      })
      .catch(done)
  })
  it('adopt failed (not logged in)', (done) => {
    request(app)
      .patch(`/pets/${pet._id}`)
      .set('acess_token', '')
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Authentication Failed')
        done()
      })
      .catch(done)
  })
})

describe('delete pet tests', () => {
  it('delete success', (done) => {
    request(app)
      .delete(`/pets/${pet._id}`)
      .set('access_token', access_token)
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(200)
        expect(body).toHaveProperty('message', 'Successfully delete pet')
        done()
      })
      .catch(done)
  })
  it('delete failed (id not found)', (done) => {
    request(app)
      .delete(`/pets/5fd08ff84860bd089c5c5369`)
      .set('access_token', access_token)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(404)
        expect(body).toHaveProperty('message', 'Pet is not found')
        done()
      })
      .catch(done)
  })
  it ('delete failed (not logged in)', (done) => {
    request(app)
      .delete(`/pets/${pet._id}`)
      .then((res) => {
        const { status, body } = res
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Authentication Failed')
        done()
      })
      .catch(done)
  })
})