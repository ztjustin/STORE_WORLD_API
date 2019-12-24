const model = require('../models/category')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer')

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const newCategoryItem = async req => {
    return new Promise((resolve, reject) => {
      const category = new model({
        name: req.name,
        verification: uuid.v4()
      })
      category.save((err, item) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        // Removes properties with rest operator
        const removeProperties = ({
          // eslint-disable-next-line no-unused-vars
          password,
          // eslint-disable-next-line no-unused-vars
          blockExpires,
          // eslint-disable-next-line no-unused-vars
          loginAttempts,
          ...rest
        }) => rest
        resolve(removeProperties(item.toObject()))
      })
    })
  }