const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
EquipmentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Equipment', EquipmentSchema)