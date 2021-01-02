const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      unique: false,
      required: true,
    },
    
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    engine: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: ["Excelente", "Muy Bueno", "Bueno", "Regular"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    tradable: {
      type: Boolean,
      required: true,
    },
    exteriorColor: {
      type: String,
      unique: false,
      required: true,
    },
    interiorColor: {
      type: String,
      unique: false,
      required: true,
    },
    fuel: {
      type: String,
      enum: ["Gasolina", "Diesel", "Hibrido", "Electrico"],
      required: true,
    },
    transmision: {
      type: String,
      enum: ["Manual", "Automatico"],
      required: true,
    },
    km: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Boolean,
      default: false,
      required: true,
    },
    receivedCar: {
      type: Boolean,
      default: false,
      required: false,
    },
    licensePlate: {
      type: String,
      unique: false,
      required: true,
    },
    doors: {
      type: Number,
      required: true,
    },
    province: {
      type: String,
      enum: [
        "Alajuela",
        "Cartago",
        "San Jose",
        "Puntarenas",
        "Heredia",
        "Limon",
        "Guanacaste",
      ],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      required: true,
    },
    // confirmed: {
    //   type: Boolean,
    //   default: false,
    //   required: true,
    // },
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    urlImages: [ { url: { type: String, required: true} } ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Products", ProductSchema);
