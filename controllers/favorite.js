const { db, ObjectID } = require('../config/mongo')
// const FavPetColl = db.collection('Favorites')
const FavPetColl = db.collection('favPets-test')

class FavoritesPetController {

  static async postFavorite(req, res, next) {
    try {
      const dataBody = req.body
      if(!dataBody.name) {
        throw { message: 'Empty Data' , status: 400 }
      } else {
        const newFavData = await FavPetColl.insertOne(dataBody)
        res.status(200).json(newFavData.ops[0])
      }
    } catch (err) {
      next(err)
    }
  }

  static async getAllFavorite(req, res, next) {
    try {
      const allDataFav = await FavPetColl.find().toArray()
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
        res.status(401).json({ msg: "No documents matched the query. Deleted 0 documents." })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = FavoritesPetController