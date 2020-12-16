const router = require('express').Router()
const user_route = require('./user_route')
const pets_route = require('./pets_route')
const fav_route = require('./favorite_route')

router.use('/', user_route)
router.use('/pets', pets_route)
router.use('/favorites', fav_route)

module.exports = router