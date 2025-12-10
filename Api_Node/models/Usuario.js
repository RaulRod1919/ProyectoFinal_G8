const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  rol: {
    type: String,
    required: true,
    enum: ["Admin", "Bodegero"],
    trim: true
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema, "usuarios");
