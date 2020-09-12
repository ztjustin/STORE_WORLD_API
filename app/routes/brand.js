const controller = require('../controllers/brands')
const validate = require('../controllers/brands.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 * Brands routes
*/

/*
 * Get all items route
*/
router.get('/all', controller.getAllItems)

module.exports = router