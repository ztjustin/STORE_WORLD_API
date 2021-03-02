require("dotenv").config();
const model = require("../models/product");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
const db = require("../middleware/db");
const emailer = require("../middleware/emailer");

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const urlImagesArray = await getArrayUrlImages(req.files);

    const product = new model({
      model: req.body.model,
      brand: req.body.brand,
      engine: req.body.engine,
      category: req.body.category,
      year: req.body.year,
      state: req.body.state,
      price: req.body.price,
      like: req.body.like,
      tradable: req.body.tradable,
      exteriorColor: req.body.exteriorColor,
      interiorColor: req.body.interiorColor,
      fuel: req.body.fuel,
      transmision: req.body.transmision,
      km: req.body.km,
      taxes: req.body.taxes,
      receivedCar: req.body.receivedCar,
      licensePlate: req.body.licensePlate,
      doors: req.body.doors,
      province: req.body.province,
      comment: req.body.comment,
      featured: req.body.featured,
      user: req.user._id,
      urlImages: urlImagesArray,
      equipment: req.body.equipment,
    });

    product.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }

      product
        .populate("brand")
        .populate("equipment")
        .populate("category", (err, item) => {
          if (err) {
            reject(utils.buildErrObject(422, err.message));
          }
          resolve(item);
        });
    });
  });
};

/********************
 * Get Array Images *
 ********************/

const getArrayUrlImages = (files, urlPath) => {
  let array = [];

  if (files.images) {
    files.images.map((file) => {
      let urlImage = file.location;
      array.push({ url: urlImage });
    });
  }

  return array;
};

/**
 * Gets all items by USER from database
 */
const getAllItemsFromDBByUser = async (req) => {
  return new Promise((resolve, reject) => {
    model.find(
      { user: req.user._id },
      "-updatedAt -createdAt",
      {},
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message));
        }
        resolve(items);
      }
    ).pagin;
  });
};

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query);
    res
      .status(200)
      .json(
        await db.getItems(req, model, query, ["equipment", "brand", "category"])
      );
    // res.status(200).json(await getAllFeaturedsItems())
  } catch (error) {
    utils.handleError(res, error);
  }
};

// exports.getCookies = async (req, res) => {
//   try {
//     console.log(req.cookies)
//     res.send(req.cookies)
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getnewItems = async (req, res) => {
  try {
    const query = await db.checkQueryStringDates(req.query);
    res.status(200).json(await db.getItems(req, model, query));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req);
    const id = await utils.isIDGood(req.id);
    res.status(200).json(await db.getItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req);
    const id = await utils.isIDGood(req.id);
    const doesEmailExists = await emailer.emailExistsExcludingMyself(
      id,
      req.email
    );
    if (!doesEmailExists) {
      res.status(200).json(await db.updateItem(id, model, req));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    const item = await createItem(req, res);
    res.status(201).json(item);
    // if(!req.files['images']){
    //   res.status(422).json({
    //     'errors' : {
    //       "msg": [
    //         {
    //             "msg": "MISSING FILE",
    //             "param": "images",
    //             "location": "file"
    //         }
    //       ]
    //     }
    //   });
    // }else{
    //   const item = await createItem(req,res)
    //   res.status(201).json(item)
    // }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req);
    const id = await utils.isIDGood(req.id);
    res.status(200).json(await db.deleteItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemsByUser = async (req, res) => {
  try {
    res
      .status(200)
      .json(
        await db.getItemsByUser(req, model, ["equipment", "brand", "category"])
      );
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getnewItems = async (req, res) => {
  try {
    const query = await db.checkQueryStringDates(req.query);
    res.status(200).json(await db.getItems(req, model, query));
  } catch (error) {
    utils.handleError(res, error);
  }
};
