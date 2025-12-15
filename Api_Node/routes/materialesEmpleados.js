const express = require("express");
const router = express.Router();
const MaterialEmpleado = require("../models/MaterialEmpleado");

// ===============================
// ➕ CREAR ASIGNACIÓN
// ===============================
router.post("/", async (req, res) => {
  try {
    const { codigo, detalle } = req.body;

    if (typeof codigo !== "number") {
      return res.status(400).json({ error: "El código del empleado debe ser numérico" });
    }

    const materialEmpleado = new MaterialEmpleado({
      codigo,
      detalle
    });

    const saved = await materialEmpleado.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===============================
// 📥 LISTAR TODOS
// ===============================
router.get("/", async (req, res) => {
  try {
    const lista = await MaterialEmpleado.find()
      .populate("detalle.idMaterial"); // ✅ SOLO materiales

    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// 📥 OBTENER POR ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const materialEmpleado = await MaterialEmpleado.findById(req.params.id)
      .populate("detalle.idMaterial");

    if (!materialEmpleado) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(materialEmpleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// 🔄 ACTUALIZAR
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updated = await MaterialEmpleado.findByIdAndUpdate(
      req.params.id,
      { detalle: req.body.detalle },
      { new: true }
    ).populate("detalle.idMaterial");

    if (!updated) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===============================
// 🗑 ELIMINAR
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MaterialEmpleado.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
