const model = require('../models/category')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')


/*********************
 * Private functions *
 *********************/

/**
 * Checks if a Category already exists in database
 * @param {string} name - name of item
 */
const categoryExists = async name => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        name
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'CATEGORY_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

/**
 * Gets all items from database
*/
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          name: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

/*********************
 * Public functions *
 *********************/

 /**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    utils.handleError(res, error)
  }
}

 /**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    req = matchedData(req)
    const doesCategoryExists = await categoryExists(req.name)
    if (!doesCategoryExists) {
      res.status(201).json(await db.createItem(req, model))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const doesCityExists = await cityExistsExcludingItself(id, req.name)
    if (!doesCityExists) {
      res.status(200).json(await db.updateItem(id, model, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
