const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')


/**
 * Validates create new category request
 */
exports.newCategoryItem = [
    check('name')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .isLength({
        min: 5
      })
      .withMessage('CATEGORY_TOO_SHORT_MIN_5'),
    (req, res, next) => {
      validationResult(req, res, next)
    }
  ]