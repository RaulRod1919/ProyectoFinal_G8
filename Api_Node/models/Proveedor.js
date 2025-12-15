const mongoose = require("mongoose");

const ProveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Proveedor", ProveedorSchema);
