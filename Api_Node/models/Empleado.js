const mongoose = require("mongoose");

const EmpleadoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido1: {
    type: String,
    required: true,
    trim: true
  },
  apellido2: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Empleado", EmpleadoSchema, "empleados");
