const controller = require("../controllers/products");
const validate = require("../controllers/products.validate");
const AuthController = require("../controllers/auth");
const uploadImages = require("../middleware/uploadImages");
const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");

/*
 * Get all items route
 */
router.get(
  "/all",
  requireAuth,
  AuthController.roleAuthorization(["admin"]),
  controller.getItems
);

/*
 * Create new item route
 */
router.post(
  "/",
  uploadImages.upload,
  requireAuth,
  AuthController.roleAuthorization(["admin"]),
  trimRequest.all,
  validate.createItem,
  controller.createItem
);

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  AuthController.roleAuthorization(["admin"]),
  trimRequest.all,
  controller.getItems
)


/*
 * Get items route
 */
// router.get("/", trimRequest.all, controller.getItems);

/*
 * Get the most new Products route
 */
// router.get(
//   '/AllnewProducts',
//   trimRequest.all,
//   controller.getnewItems
// )

router.get(
  "/allMyProducts",
  requireAuth,
  AuthController.roleAuthorization(["admin"]),
  controller.getItemsByUser
);

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

module.exports = router;
