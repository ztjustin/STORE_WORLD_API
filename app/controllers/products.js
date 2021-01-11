const model = require("../models/product");
const uuid = require("uuid");
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
    urlPath = "https://cr-auto.herokuapp.com";
    const urlImagesArray = await getArrayUrlImages(req.files, urlPath);

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
      user: req.body.user,
      urlImages: urlImagesArray,
      equipment: req.body.equipment,
    });
    product.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }

      resolve(item);
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
      let urlImage = urlPath + "/images/" + file.filename;
      array.push({ url: urlImage });
    });
  }

  return array;
};

/********************
 * Multer functions *
 ********************/

const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Type");

    if (isValid) {
      error = null;
    }
    cb(error, "public/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + + "-" + uuid()  +"." + ext);
  },
});

exports.upload = multer({ storage: storage }).fields([
  { name: "images", maxCount: 5 },
]);

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
      .json(await db.getItems(req, model, query, ["equipment", "brand"]));
    // res.status(200).json(await getAllFeaturedsItems())
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
 * Gets all items from database
 */
const getAllFeaturedsItems = async () => {
  return new Promise((resolve, reject) => {
    model
      .find(
        { featured: true },
        {},
        { sort: { createdAt: -1 } },
        (err, items) => {
          if (err) {
            reject(utils.buildErrObject(422, err.message));
          }
          resolve(items);
        }
      )
      .limit(2);
  });
};
