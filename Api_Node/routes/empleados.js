const express = require("express");
const router = express.Router();
const Empleado = require("../models/Empleado");

router.post("/", async (req, res) => {
  try {
    const empleado = new Empleado(req.body);
    const nuevoEmpleado = await empleado.save();

    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);

    if (!empleado)
      return res.status(404).json({ message: "Empleado no encontrado" });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!empleadoActualizado)
      return res.status(404).json({ message: "Empleado no encontrado" });

    res.json(empleadoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const empleadoEliminado = await Empleado.findByIdAndDelete(req.params.id);

    if (!empleadoEliminado)
      return res.status(404).json({ message: "Empleado no encontrado" });

    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
