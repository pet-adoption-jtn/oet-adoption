async function init () {
  try {
    await db.createCollection('Users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'username',
            'email',
            'password'
          ],
          properties: {
            username: {
              bsonType: 'string',
              description: 'username is required and must be a string'
            },
            email: {
              bsonType: 'string',
              description: 'email is required and must be a string',
              pattern: '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
            },
            password: {
              bsonType: 'string',
              description: 'password is required and must be as'
            }
          }
        }
      }
    })
    await db.createCollection('Pets', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'name',
            'breed',
            'age',
            'gender',
            'color',
            'pictures',
            'user_id',
            'type',
            'status',
            'request'
          ],
          properties: {
            name: {
              bsonType: 'string',
              description: 'name is required and must be a string'
            },
            breed: {
              bsonType: 'string',
              description: 'breed is requried and must be a string'
            },
            age: {
              bsonType: 'string',
              'enum': [
                'baby',
                'young',
                'adult',
                'senior'
              ],
              description: 'age is required, must be a string, and must be one of the enums'
            },
            gender: {
              bsonType: 'string',
              'enum': [
                'male',
                'female'
              ],
              description: 'string, must be one of the enums'
            },
            pictures: {
              bsonType: 'array',
              description: 'required and an array'
            },
            type: {
              bsonType: 'string',
              'enum': [
                'dog',
                'cat'
              ],
              description: 'string, must be one of the enums'
            },
            status: {
              bsonType: 'bool',
              description: 'true for adopted, false for not'
            },
            request: {
              bsonType: 'array',
              description: 'if length 0 => theres no request for adoption yet'
            },
            color: {
              bsonType: 'string',
              description: 'color is required and must be a string'
            },
            user_id: {
              bsonType: 'objectId',
              description: 'required'
            }
          }
        }
      }
    })
    await db.createCollection('Favorites', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'pet_id',
            'user_id'
          ],
          properties: {
            pet_id: {
              bsonType: 'objectId'
            },
            user_id: {
              bsonType: 'objectId'
            }
          }
        }
      }
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = init
