const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
} = require("../middleware/utils");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * True if provided object ID valid
 * @param {string} id
 */
const isObjectIdValid = (id) => {
  return ObjectId.isValid(id) && new ObjectId(id) == id;
};

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {};
  sortBy[sort] = order;
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result) => {
  result.docs.map((element) => delete element.id);
  return result;
};

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req, [...populate]) => {
  return new Promise((resolve) => {
    const order = req.query.order || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const options = {
      sort: sortBy,
      // lean: true,
      populate: [...populate],
      page,
      limit,
    };
    resolve(options);
  });
};

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      try {
        if (
          typeof query.filter !== "undefined" &&
          typeof query.fields !== "undefined"
        ) {
          const data = {
            $or: [],
          };
          const array = [];
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = query.fields.split(",");

          const filter = query.filter.toLowerCase();

          // Adds SQL Like %word% with regex
          arrayFields.map((item) => {
            if (filter == "true" || filter == "false" ) {
              array.push({
                [item]: {
                  $eq: Boolean(filter),
                },
              });
            } else if (isObjectIdValid(query.filter)) {
              array.push({
                [item]: {
                   $eq: query.filter,
                },
              });
            } else {
              array.push({
                [item]: {
                  $regex: new RegExp(query.filter, "i"),
                },
              });
            }
          });
          // Puts array result in data
          data.$or = array;
          resolve(data);
        } else {
          resolve({});
        }
      } catch (err) {
        console.log(err.message);
        reject(buildErrObject(422, "ERROR_WITH_FILTER"));
      }
    });
  },

  /**
   * Checks the query string for filtering records
   * between a range of Days
   * query.filter should be the number of days to search (number)
   * @param {Object} query - query object
   */
  async checkQueryStringDates(query) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof query.days !== "undefined") {
          var date = new Date(); // now
          date.setDate(date.getDate() - query.days);
          const data = {
            createdAt: { $gte: date },
          };

          resolve(data);
        } else {
          reject(buildErrObject(422, "MISSING_DAYS_PARAMETER_QUERY"));
        }
      } catch (err) {
        reject(buildErrObject(422, "ERROR_WITH_RANGE_DAYS"));
      }
    });
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query, populate = "") {
    console.log(query)
    const options = await listInitOptions(req, populate);
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(cleanPaginationID(items));
      });
    });
  },

  /**
   * Gets items from database by User
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItemsByUser(req, model, populate = "") {
    const options = await listInitOptions(req, populate);
    return new Promise((resolve, reject) => {
      model.paginate({ user : req.user._id }, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(cleanPaginationID(items));
      });
    });
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(item);
      });
    });
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(item);
      });
    });
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true,
        },
        (err, item) => {
          itemNotFound(err, item, reject, "NOT_FOUND");
          resolve(item);
        }
      );
    });
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findByIdAndRemove(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(buildSuccObject("DELETED"));
      });
    });
  },
};
