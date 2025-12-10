const express = require("express");
const router = express.Router();
const Herramienta = require("../models/Herramienta");

router.post("/", async (req, res) => {
  try {
    const herramienta = new Herramienta(req.body);
    const nuevaHerramienta = await herramienta.save();

    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const herramientas = await Herramienta.find();
    res.json(herramientas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const herramienta = await Herramienta.findById(req.params.id);

    if (!herramienta)
      return res.status(404).json({ message: "Herramienta no encontrada" });

    res.json(herramienta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const herramientaActualizada = await Herramienta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!herramientaActualizada)
      return res.status(404).json({ message: "Herramienta no encontrada" });

    res.json(herramientaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const herramientaEliminada = await Herramienta.findByIdAndDelete(req.params.id);

    if (!herramientaEliminada)
      return res.status(404).json({ message: "Herramienta no encontrada" });

    res.json({ message: "Herramienta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
