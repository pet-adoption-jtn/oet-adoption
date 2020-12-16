const { db, ObjectID } = require('../config/mongo')
const FavPetColl = db.collection('Favorites')
const pets_collection = db.collection('Pets')

class FavoritesPetController {

  static async postFavorite(req, res, next) {
    try {
      const { pet_id } = req.body
      if(!pet_id) {
        throw { message: 'Empty Data' , status: 400 }
      } else {
        const favoriteCopy = await FavPetColl.findOne({
          pet_id: ObjectID(pet_id)
        })
        if (favoriteCopy) {
          throw { status: 400, message: 'Already in favorites' }
        } else {
          const newFavData = await FavPetColl.insertOne({
            pet_id: ObjectID(pet_id),
            user_id: ObjectID(req.userLoggedIn._id)
          })
          if (newFavData.insertedCount === 1) {
            const pet_data = await pets_collection.findOne({
              _id: ObjectID(pet_id)
            })
            res.status(200).json({
              ...newFavData.ops[0],
              Pet: pet_data
            })
          } else {
            throw { status: 400, message: 'Failed add to favorites' }
          }   
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async getAllFavorite(req, res, next) {
    try {
      const allDataFav = await FavPetColl.aggregate([
        {
          $lookup: {
            from: 'Pets',
            localField: 'pet_id',
            foreignField: '_id',
            as: 'Pet'
          }
        },
        {
          $unwind: {
            path: '$Pet'
          }
        },
        {
          $match: {
            user_id: ObjectID(req.userLoggedIn._id)
          }
        }
      ]).toArray()
      res.status(200).json(allDataFav)
    } catch (err) {
      next(err)
    }
  }

  static async deleteFavPet(req, res, next) {
    try {
      const id = req.params.id
      const delFavPet = await FavPetColl.deleteOne({ _id: ObjectID(id) })
      if( delFavPet.deletedCount === 1) {
        res.status(200).json({ msg: "Successfully deleted one Pet Favorites." })
      } else {
        throw { status: 404, message: "No documents matched the query. Deleted 0 documents." }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = FavoritesPetController