const mongoose = require("mongoose");

const HerramientaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  codigoUnidad: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Herramienta", HerramientaSchema, "herramientas");
