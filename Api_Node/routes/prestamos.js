const express = require("express");
const router = express.Router();
const PrestamoHerramienta = require("../models/PrestamoHerramienta");

router.post("/", async (req, res) => {
  try {
    const prestamo = new PrestamoHerramienta(req.body);
    const nuevoPrestamo = await prestamo.save();

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const prestamos = await PrestamoHerramienta.find()
      .populate("idEmpleado", "codigo nombre apellido1 apellido2")
      .populate("idHerramienta", "nombre codigoUnidad estado");

    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const prestamo = await PrestamoHerramienta.findById(req.params.id)
      .populate("idEmpleado", "codigo nombre apellido1 apellido2")
      .populate("idHerramienta", "nombre codigoUnidad estado");

    if (!prestamo)
      return res.status(404).json({ message: "Préstamo no encontrado" });

    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const prestamoActualizado = await PrestamoHerramienta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prestamoActualizado)
      return res.status(404).json({ message: "Préstamo no encontrado" });

    res.json(prestamoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const prestamoEliminado = await PrestamoHerramienta.findByIdAndDelete(req.params.id);

    if (!prestamoEliminado)
      return res.status(404).json({ message: "Préstamo no encontrado" });

    res.json({ message: "Préstamo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
