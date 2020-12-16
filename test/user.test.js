const app = require('../app');
const request = require('supertest');
const { db } = require('../config/mongo');
const { afterAll, beforeAll, it, expect, describe } = require('@jest/globals');
const { hashPassword } = require('../helpers/bcrypt')

describe('TEST ENDPOINT /register', () => {
  beforeAll(async () => {
    users = db.collection('Users');
  }); 
  
  afterAll(async () => {
    await db.collection('Users').deleteMany({ })
    await connection.close();
  });
    
  
  it(('testing register is successfull'), async (done) => {
    const newUser = {
      username: 'example',
      email: 'example@mail.com',
      password: '123456',
      address: 'jakarta',
      phone: '08123456789'
    };

    request(app)
    .post('/register')
    .send(newUser)
      .then((res) => {
        const { body, status } = res
        expect(status).toEqual(201);
        expect(body).toHaveProperty('_id', expect.any(String));
        expect(body).toHaveProperty('email', 'example@mail.com');
        expect(body).toHaveProperty('username', 'example');
        done()
      })
      .catch(done)
  });

  it (('testing register when email is unique'), async (done) => {
    const newUser = {
      username: 'example',
      email: 'example@mail.com',
      password: '123456',
      address: 'jakarta',
      phone: '08123456789'
    };

    request(app)
    .post('/register')
    .send(newUser)
      .then(res => {
        const { status, body } = res
        expect(status).toEqual(400)
        expect(body).toHaveProperty('message', 'Email already exists')

        done()
      })
      .catch(done)
  })

  it(('testing register if password is less than 6 characters'), async (done) => {
    const newUser = {
      username: 'example',
      email: 'example@mail.com',
      password: '1234',
      address: 'jakarta',
      phone: '08123456789'
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
  });

  it(('testing register if email or phone or address is empty string'), async (done) => {
    const newUser = {
      username: 'example',
      email: '',
      password: '123456',
      address: '',
      phone: ''
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
  });

  it(('testing register if username is less than 6 characters'), async (done) => {
    const newUser = {
      username: 'ex',
      email: 'example@mail.com',
      password: '123456',
      address: 'jakarta',
      phone: '08123456789'
    };

    request(app)
    .post('/register')
    .send(newUser)
      .then(res => {
        const { status, body } = res
        expect(status).toEqual(400)
        expect(body).toHaveProperty('message', 'Minimum username is six characters')
        
        done()
      })
      .catch(done)
  })

  it(('testing register if phone number is less than eleven characters'), async (done) => {
    const newUser = {
      username: 'example',
      email: 'example@mail.com',
      password: '123456',
      address: 'jakarta',
      phone: '08123'
    }

    request(app)
    .post('/register')
    .send(newUser)
      .then(res  => {
        const { status, body } = res
        expect(status).toEqual(400)
        expect(body).toHaveProperty('message', 'Phone must have a minimum of eleven characters')

        done()
      })
      .catch(done)
  })

  it(('testing register if username or phone or username or email or password or address is null'), async (done) => {
    const newUser = {
      username: null,
      email: null,
      password: null,
      address: null,
      phone: null
    }

    request(app)
    .post('/register')
    .send(newUser)
      .then(res  => {
        const { status, body } = res
        expect(status).toEqual(400)
        expect(body).toHaveProperty('message', 'Please fill all the columns')

        done()
      })
      .catch(done)
  })
});

describe('TEST ENDPOINT /login', () => {
  beforeAll(async () => {
    users = db.collection('Users');

    const user = {
      email: 'example@mail.com',
      password: hashPassword('123456'),
      phone: '081905056936',
      address: 'jakarta',
      username: 'examspl'
    }
    const insertUser = await users.insertOne(user)
  });

  afterAll(async () => {
    await db.collection('Users').deleteMany({ })
    await connection.close();
  });

  it ('testing login if is successfull', async (done) => {
    const user = {
      email: 'example@mail.com',
      password: '123456'
    }

    request(app)
    .post('/login')
    .send(user)
      .then(res => {
        const { status, body } = res
        expect(status).toBe(200);
        expect(body).toHaveProperty('access_token', expect.any(String))

        done()
      })
      .catch(done)
  })

  it (('testing login if password is wrong'), async (done) => {
    const user = {
      email: 'example@mail.com',
      password: '12'
    }

    request(app)
    .post('/login')
    .send(user)
      .then(res =>  {
        const { status, body }  = res
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Invalid email/password')

        done()
      })
      .catch(done)
  })

  it (("testing login if user doesn't found"), async (done) => {
    const user = {
      email: 'kurakuranija@mail.com',
      password: '123456789'
    }

    request(app)
    .post('/login')
    .send(user)
      .then(res => {
        const { status, body } = res
        expect(status).toEqual(401)
        expect(body).toHaveProperty('message', 'Invalid email/password')
        
        done()
      })
      .catch(done)
  })
})