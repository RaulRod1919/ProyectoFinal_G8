const express = require("express");
const router = express.Router();
const Proveedor = require("../models/Proveedor");

router.post("/", async (req, res) => {
  try {
    const proveedor = new Proveedor(req.body);
    const nuevoProveedor = await proveedor.save();

    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);

    if (!proveedor)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!proveedorActualizado)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);

    if (!proveedorEliminado)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
