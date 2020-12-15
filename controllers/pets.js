const { db } = require('../config/mongo')
const { ObjectID } = require('mongodb')
const { sendMail, generateMessage, generateMessageApproval, generateMessageDecline } = require('../helpers/nodemailer')

const pets = db.collection('Pets')

class PetController {
  static async readAll (req, res, next) {
    try {
      const petlist = await pets.aggregate([
        {
          $match: {
            ...req.query,
            status: false
          }
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'Owner'
          },
        },
        {
          $unwind: {
            path: '$Owner'
          }
        }
      ]).toArray()
      res.status(200).json(petlist)

    } catch (error) {
      next(error)
    }
  }

  static async getOnePet (req, res, next) {
    try {
      const id = req.params.id
      const pet = await pets.aggregate([
        {
          $match: {
            _id: ObjectID(id)
          }
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'Owner'
          }
        },
        {
          $unwind: {
            path: '$Owner'
          }
        }
      ]).toArray()
      if (pet.length > 0) {
        res.status(200).json(pet[0])
      } else {
        throw { status: 404, message: 'Pet is not found' }
      }
    } catch (error) {
      next(error)
    }
  }

  static async addPet (req, res, next) {
    try {
      const user = req.userLoggedIn
      const payload = { 
        name: req.body.name,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        color: req.body.color,
        type: req.body.type,
        status: false,
        request: [],
        pictures: req.body.pictures,
        user_id: ObjectID(user._id)
      }
      const result = await pets.insertOne(payload)
      if (result.insertedCount !== 1) {
        throw { message: 'Insert Pet Failed', status: 400 }
      } else {
        res.status(201).json(result.ops[0])
      }
    } catch (error) {
      next(error)
    }
  }

  static async requestAdoption(req, res, next) {
    try {
      const { pet_detail, form_data, adopter } = req.body
      const updateRequest = await pets.findOneAndUpdate({
        "_id": ObjectID(pet_detail._id)
      }, {
        $set: {
          request: [
            ...pet_detail.request,
            adopter
          ]
        }
      }, {
        returnOriginal: false
      })
      if (updateRequest.value.name) {
        const message = generateMessage(form_data)
        sendMail({
          recipient: pet_detail.Owner.email, 
          subject: `Adoption Request for ${pet_detail.name}`, 
          message
        })
        res.status(200).json({ message: 'Adoption form delivered to owner', pet: updateRequest.value })
      } else {
        res.status(404).json({ message: 'Pet Not Found' })
      }
    } catch (error) {
      next(error)
    }
  }

  static async getPetByOwner(req, res, next) {
    try {
      const user_id = req.userLoggedIn._id
      const pet_owned = await pets.find({
        user_id: ObjectID(user_id)
      }).toArray()
      res.status(200).json(pet_owned)
    } catch (error) {
      next(error)
    }
  }

  static async updatePet(req, res, next) {
    try {
      const id = req.params.id
      const payload = { 
        name: req.body.name,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        color: req.body.color,
        type: req.body.type
      }
      const result = await pets.findOneAndUpdate({
        "_id": ObjectID(id)
      }, {
        $set: payload
      }, {
        returnOriginal: false
      })
      if (result.value) {
        res.status(200).json(result.value)
      } else {
        throw { message: 'Update failed', status: 400 }
      }
    } catch (error) {
      next(error)
    }
  }

  static async adoptPet (req, res, next) {
    try {
      const id = req.params.id
      const { status, adopter, pet } = req.body

      const payload = {}

      if (status) {
        payload.status = status
        payload.user_id = ObjectID(adopter._id)
        payload.request = []
      } else {
        payload.status = status
        payload.request = pet.request.filter(request => request._id.toString() !== adopter._id.toString())
      }
      const result = await pets.findOneAndUpdate({
        "_id": ObjectID(id)
      }, {
        $set: payload
      }, {
        returnOriginal: false
      })
      if (result.value.status === true) {
        sendMail({
          recipient: adopter.email,
          subject: `Your adoption request for ${result.value.name}`,
          message: generateMessageApproval(result.value)
        })
        sendMail({
          recipient: pet.request.filter(request => request._id.toString() !== adopter._id.toString()),
          subject: `Your adoption request for ${result.value.name}`,
          message: generateMessageDecline(result.value)
        })
        res.status(200).json({ message: 'Adoption Successfull', data: result.value })
      } else {
        sendMail({
          recipient: adopter.email,
          subject: `Your adoption request for ${result.value.name}`,
          message: generateMessageDecline(result.value)
        })
        res.status(200).json({ message: 'Adoption Canceled', data: result.value })
      }
    } catch (error) {
      next(error)
    }
  }

  static async deletePet (req, res, next) {
    try {
      const id = req.params.id
      const result = await pets.deleteOne({
        "_id": ObjectID(id)
      })
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Successfully delete pet' })
      } else {
        throw { message: 'Pet is not found', status: 404 }
      }
    } catch (error) {
      next(error)
    }
  }
} 

module.exports = PetController