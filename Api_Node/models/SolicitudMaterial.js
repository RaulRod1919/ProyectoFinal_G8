const mongoose = require("mongoose");

const SolicitudMaterialSchema = new mongoose.Schema({
  idProveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Recibido"],
    default: "Pendiente",
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
      },
      precioTotalNeto: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model(
  "SolicitudMaterial",
  SolicitudMaterialSchema,
  "solicitudMaterial"
);
