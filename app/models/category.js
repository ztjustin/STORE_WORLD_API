const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      unique: true,
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
CategorySchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Category', CategorySchema)