const mongoose = require("mongoose");

const MaterialProyectoSchema = new mongoose.Schema({
  idProyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
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

module.exports = mongoose.model("MaterialProyecto", MaterialProyectoSchema, "materialesProyectos");
