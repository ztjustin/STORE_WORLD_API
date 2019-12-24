
const controller = require('../controllers/category')
const validate  = require('../controllers/category.validate')
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
 * Create new item route
*/
router.post(
    '/category',
    requireAuth,
    AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.newCategoryItem,
    controller.newCategoryItem
)