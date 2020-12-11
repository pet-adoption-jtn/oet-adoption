const { afterAll, beforeAll, it, expect } = require('@jest/globals');
const { signToken } = require('../helpers/jwt')
const request = require('supertest');
const app = require('../app')

let access_token;

beforeAll(async () => {
  access_token = signToken({
    id: 1,
    name: 'user',
    email: 'user@mail.com'
  })
})

afterAll(async () => {
  access_token = null
})

describe('add new pet test', () => {
  it('add pet success', (done) => {
    const newPet = {
      name: 'Kora',
      breed: 'Alaskan Mullet',
      age: 'baby',
      gender: 'male',
      color: 'white'
    }
    request(app)
      .post('/pets')
      .set('access_token', access_token)
      .send(newPet)
      .then((res) => {
        const { body, status } = res

        expect(status).toEqual(201)
        expect(body).toHaveProperty('name', 'Kora')
        expect(body).toHaveProperty('breed', 'Alaskan Mullet')
        expect(body).toHaveProperty('age', 'baby')
        expect(body).toHaveProperty('gender', 'male')
        expect(body).toHaveProperty('color', 'white')

        done()
      })
      .catch(done)
  })

})