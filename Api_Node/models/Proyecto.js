const mongoose = require("mongoose");

const ProyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  centroCostos: {
    type: String,
    required: true,
    trim: true
  },
  idArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Proyecto", ProyectoSchema, "proyectos");
