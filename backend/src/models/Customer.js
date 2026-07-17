const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [60, "El nombre no puede superar 60 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minlength: [2, "El apellido debe tener al menos 2 caracteres"],
      maxlength: [60, "El apellido no puede superar 60 caracteres"],
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "El correo no tiene un formato valido"],
    },
    telefono: {
      type: String,
      trim: true,
      minlength: [7, "El telefono debe tener al menos 7 caracteres"],
      maxlength: [20, "El telefono no puede superar 20 caracteres"],
    },
    direccion: {
      calle: {
        type: String,
        trim: true,
        maxlength: [120, "La calle no puede superar 120 caracteres"],
      },
      numero: {
        type: String,
        trim: true,
        maxlength: [20, "El numero no puede superar 20 caracteres"],
      },
      comuna: {
        type: String,
        trim: true,
        maxlength: [80, "La comuna no puede superar 80 caracteres"],
      },
      ciudad: {
        type: String,
        trim: true,
        maxlength: [80, "La ciudad no puede superar 80 caracteres"],
      },
      region: {
        type: String,
        trim: true,
        maxlength: [80, "La region no puede superar 80 caracteres"],
      },
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
