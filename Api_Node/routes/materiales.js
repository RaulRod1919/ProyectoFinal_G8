const express = require("express");
const router = express.Router();
const Material = require("../models/Material");

router.post("/", async (req, res) => {
  try {
    const material = new Material(req.body);
    const nuevoMaterial = await material.save();

    res.status(201).json(nuevoMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const materiales = await Material.find();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material)
      return res.status(404).json({ message: "Material no encontrado" });

    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const materialActualizado = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!materialActualizado)
      return res.status(404).json({ message: "Material no encontrado" });

    res.json(materialActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const materialEliminado = await Material.findByIdAndDelete(req.params.id);

    if (!materialEliminado)
      return res.status(404).json({ message: "Material no encontrado" });

    res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
