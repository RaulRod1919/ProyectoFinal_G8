const express = require("express");
const router = express.Router();
const MaterialProyecto = require("../models/MaterialProyecto");

router.post("/", async (req, res) => {
  try {
    const materialProyecto = new MaterialProyecto(req.body);
    const saved = await materialProyecto.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const lista = await MaterialProyecto.find()
      .populate("idProyecto")
      .populate("detalle.idMaterial");
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const materialProyecto = await MaterialProyecto.findById(req.params.id)
      .populate("idProyecto")
      .populate("detalle.idMaterial");

    if (!materialProyecto) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(materialProyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await MaterialProyecto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("idProyecto")
      .populate("detalle.idMaterial");

    if (!updated) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await MaterialProyecto.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MaterialProyecto.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
