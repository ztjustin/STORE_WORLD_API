const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      unique: true,
      required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    itemsSold: {
      type: Number,
      default: 0,
    },
    like: {
      type: Number,
      default: 0,
    },
    urlImage: {
      type: String,
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
ProductSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', ProductSchema)