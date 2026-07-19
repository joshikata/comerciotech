const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es obligatorio"],
    },
    cantidad: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad debe ser al menos 1"],
    },
    precioUnitario: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: [0, "El precio unitario no puede ser menor a 0"],
    },
    subtotal: {
      type: Number,
      required: [true, "El subtotal es obligatorio"],
      min: [0, "El subtotal no puede ser menor a 0"],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "El cliente es obligatorio"],
    },
    productos: {
      type: [orderItemSchema],
      required: [true, "Los productos del pedido son obligatorios"],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "El pedido debe incluir al menos un producto",
      },
    },
    total: {
      type: Number,
      required: [true, "El total es obligatorio"],
      min: [0, "El total no puede ser menor a 0"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"],
      default: "pendiente",
      required: [true, "El estado es obligatorio"],
    },
    direccionEnvio: {
      type: String,
      trim: true,
      maxlength: [250, "La direccion de envio no puede superar 250 caracteres"],
    },
    fechaPedido: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
