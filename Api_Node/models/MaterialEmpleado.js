const mongoose = require("mongoose");

const MaterialEmpleadoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    ref: "Empleado",
    required: true
  },
  detalle: [
    {
      idMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("MaterialEmpleado", MaterialEmpleadoSchema, "materialesEmpleados");
