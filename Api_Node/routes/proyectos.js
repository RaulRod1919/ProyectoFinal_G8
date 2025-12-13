const express = require("express");
const router = express.Router();
const Proyecto = require("../models/Proyecto");

router.post("/", async (req, res) => {
  try {
    const proyecto = new Proyecto(req.body);
    const nuevoProyecto = await proyecto.save();

    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const proyectos = await Proyecto.find()
      .populate("idArea", "nombre");

    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Cantidad Activos
router.get("/cantidad", async (req, res) =>{
  try{
    let cantidad = await Proyecto.countDocuments().where("estado").equals(true);
    res.json({cantidad:cantidad});
  }catch(error){
    res.status(500).json({message:error.message});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
      .populate("idArea", "nombre");

    if (!proyecto)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!proyectoActualizado)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    res.json(proyectoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);

    if (!proyectoEliminado)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
