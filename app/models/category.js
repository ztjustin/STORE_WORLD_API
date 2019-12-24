const mongoose = require('mongoose')
const validator = require('validator')

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('CategorySchema', CategorySchema)