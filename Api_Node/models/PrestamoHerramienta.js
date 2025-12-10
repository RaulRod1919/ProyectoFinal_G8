const mongoose = require("mongoose");

const PrestamoHerramientaSchema = new mongoose.Schema({
  idEmpleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: true
  },
  idHerramienta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Herramienta",
    required: true
  },
  codigoUnidad: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model(
  "PrestamoHerramienta",
  PrestamoHerramientaSchema,
  "prestamosHerramientas"
);
