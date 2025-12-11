const express = require("express");
const router = express.Router();
const RequisicionOtrasAreas = require("../models/RequisicionOtrasAreas");

router.post("/", async (req, res) => {
  try {
    const requisicion = new RequisicionOtrasAreas(req.body);
    const saved = await requisicion.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const lista = await RequisicionOtrasAreas.find()
      .populate("codigo")       // Empleado
      .populate("idProyecto");  // Proyecto

    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const requisicion = await RequisicionOtrasAreas.findById(req.params.id)
      .populate("codigo")
      .populate("idProyecto");

    if (!requisicion) {
      return res.status(404).json({ error: "Requisición no encontrada" });
    }

    res.json(requisicion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await RequisicionOtrasAreas.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("codigo")
      .populate("idProyecto");

    if (!updated) {
      return res.status(404).json({ error: "Requisición no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await RequisicionOtrasAreas.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Requisición no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await RequisicionOtrasAreas.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Requisición no encontrada" });
    }

    res.json({ message: "Requisición eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
