const express = require("express");
const router = express.Router();
const SolicitudMaterial = require("../models/SolicitudMaterial");

// 🔹 Crear una nueva solicitud
router.post("/", async (req, res) => {
  try {
    const solicitud = new SolicitudMaterial(req.body);
    const saved = await solicitud.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Obtener todas las solicitudes
router.get("/", async (req, res) => {
  try {
    const lista = await SolicitudMaterial.find()
      .populate("idProveedor")
      .populate("detalle.idMaterial");

    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener una solicitud por ID
router.get("/:id", async (req, res) => {
  try {
    const solicitud = await SolicitudMaterial.findById(req.params.id)
      .populate("idProveedor")
      .populate("detalle.idMaterial");

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Actualizar una solicitud completa
router.put("/:id", async (req, res) => {
  try {
    const updated = await SolicitudMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("idProveedor")
      .populate("detalle.idMaterial");

    if (!updated) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Actualizar parcialmente (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await SolicitudMaterial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("idProveedor")
      .populate("detalle.idMaterial");

    if (!updated) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Eliminar una solicitud
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SolicitudMaterial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
