const mongoose = require("mongoose");

const RequisicionOtrasAreasSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    ref: "Empleado",
    required: true
  },
  idProyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
    required: true
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  detalle: [
    {
      material: {
        type: String,
        required: true,
        trim: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model(
  "RequisicionOtrasAreas",
  RequisicionOtrasAreasSchema,
  "requisicionOtrasAreas"
);
