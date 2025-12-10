const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Material", MaterialSchema, "materiales");
