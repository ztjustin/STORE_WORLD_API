const controller = require('../controllers/products')
const validate = require('../controllers/products.validate')
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
 * Categories routes
*/

/*
 * Get all items route
*/
router.get('/all', controller.getItems)

/*
 * Create new item route
 */
router.post(
  '/',
  controller.upload,
  requireAuth,
  AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

// /*
//  * Get item route
//  */
// router.get(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
//   trimRequest.all,
//   validate.getItem,
//   controller.getItem
// )

// /*
//  * Update item route
//  */
// router.patch(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
//   trimRequest.all,
//   validate.updateItem,
//   controller.updateItem
// )

// /*
//  * Delete item route
//  */
// router.delete(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
//   trimRequest.all,
//   validate.deleteItem,
//   controller.deleteItem
// )



module.exports = router