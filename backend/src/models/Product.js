const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [120, "El nombre no puede superar 120 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, "La descripcion no puede superar 500 caracteres"],
    },
    categoria: {
      type: String,
      required: [true, "La categoria es obligatoria"],
      trim: true,
      minlength: [2, "La categoria debe tener al menos 2 caracteres"],
      maxlength: [80, "La categoria no puede superar 80 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser menor a 0"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser menor a 0"],
    },
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "El SKU debe tener al menos 3 caracteres"],
      maxlength: [40, "El SKU no puede superar 40 caracteres"],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
