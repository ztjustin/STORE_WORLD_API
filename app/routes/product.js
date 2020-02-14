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
const multer = require("multer")

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const storage = multer.diskStorage({ 
  destination: (req,file,cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid Type");

      if(isValid){
        error = null
      }
      cb(error,"app/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + '.' + ext);

  } 
})


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
  multer({ storage: storage}).single("image"),
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