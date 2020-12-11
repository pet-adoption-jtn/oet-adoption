const app = require('../app');
const request = require('supertest');
const { MongoClient, ObjectID } = require('mongodb');
const { afterAll, beforeAll, it, expect, describe } = require('@jest/globals');

describe('TEST ENDPOINT /register', () => {

    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true,
      });
      db = await connection.db('adopt-us-test');
      users = db.collection('Users');
    }); 
    
    afterAll(async () => {
      await db.collection('Users').deleteMany({})
      await connection.close();
    });
    
    it('testing register is successfull', async (done) => {
      const newUser = {
        email: 'example@mail.com',
        password: '123456'
      };

      request(app)
      .post('/register')
      .send(newUser)
        .then((res) => {
          const { body, status } = res
          expect(status).toEqual(201);
          expect(body).toHaveProperty('_id', expect.any(String));
          expect(body).toHaveProperty('email', 'example@mail.com');
          
          done()
        })
        .catch(done)
    });

    it(('testing register if password is less than 6 characters'), async (done) => {
      const newUser = {
        email: 'example@mail.com',
        password: '1234'
      };

      request(app)
      .post('/register')
      .send(newUser)
        .then((res) => {
          const { body, status } = res
          expect(status).toEqual(400)
          expect(body).toHaveProperty('message', 'Minimum password is six characters')
          
          done()
        })
        .catch(done)
    })

    it(('testing register if email is empty string'), async (done) => {
      const newUser = {
        email: '',
        password: '123456'
      };

      request(app)
      .post('/register')
      .send(newUser)
        .then((res) => {
          const { body, status } = res
          expect(status).toEqual(400)
          expect(body).toHaveProperty('message', 'Please fill all the columns')
          
          done()
        })
        .catch(done)
    })
  });

describe('TEST ENDPOINT /login', () => {
  it(())
})