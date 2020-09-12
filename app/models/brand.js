const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const BrandSchema = new mongoose.Schema(
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
BrandSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Brand', BrandSchema)