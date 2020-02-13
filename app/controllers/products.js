const model = require('../models/product')
const db = require('../middleware/db')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')

/*********************
 * Private functions *
 *********************/

  /**
   * Gets all items from database
   */
  const getAllItemsFromDB = async () => {
    return new Promise((resolve, reject) => {
      model.find(
        {},
        '',
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

/**
 * Creates a new item in database
 * @param {Object} req - request object
*/
const createItem = async req => {
  return new Promise((resolve, reject) => {
    const product = new model({
      name: req.name,
      category: req.category,
      url: req.protocol + "://" + req.get('host')
    })
    product.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }else{
        resolve()
      }
    })
  })
}
  
  /********************
   * Public functions *
   ********************/
  
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
   * Get items function called by route
   * @param {Object} req - request object
   * @param {Object} res - response object
   */
  exports.getItems = async (req, res) => {
    try {
      const query = await db.checkQueryString(req.query)
      res.status(200).json(await db.getItems(req, model, query))
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

       console.log(req)

      const item = await createItem(req)
       
      res.status(201).json(item)
    
    } catch (error) {
      utils.handleError(res, error)
    }
  }

