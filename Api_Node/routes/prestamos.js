const express = require("express");
const router = express.Router();
const PrestamoHerramienta = require("../models/PrestamoHerramienta");
const Herramienta = require("../models/Herramienta");

router.post("/", async (req, res) => {
  try {
    const { idHerramienta } = req.body;

    const herramienta = await Herramienta.findById(idHerramienta);

    if (herramienta.estado === "Ocupada") {
      return res.status(400).json({
        message: "La herramienta ya está ocupada"
      });
    }

    const prestamo = new PrestamoHerramienta(req.body);
    const nuevoPrestamo = await prestamo.save();

    await Herramienta.findByIdAndUpdate(
      idHerramienta,
      { estado: "Ocupada" },
      { new: true }
    );

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

router.get("/cantidad", async (req, res) =>{
  try{
    let cantidad = await PrestamoHerramienta.countDocuments();
    res.json({cantidad:cantidad});
  }catch(error){
    res.status(500).json({message:error.message});
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
    const prestamo = await PrestamoHerramienta.findById(req.params.id);

    if (!prestamo)
      return res.status(404).json({ message: "Préstamo no encontrado" });

    // Liberar herramienta
    await Herramienta.findByIdAndUpdate(
      prestamo.idHerramienta,
      { estado: "Buena" }
    );

    await prestamo.deleteOne();

    res.json({ message: "Préstamo eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
