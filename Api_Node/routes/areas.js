const express = require("express");
const router = express.Router();

const Area = require("../models/Area");

router.post("/", async (req, res) => {
  try {
    const area = new Area({
      nombre: req.body.nombre
    });

    const savedArea = await area.save();
    res.status(201).json(savedArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ error: "Área no encontrada" });

    res.json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedArea = await Area.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre },
      { new: true }
    );

    if (!updatedArea)
      return res.status(404).json({ error: "Área no encontrada" });

    res.json(updatedArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedArea = await Area.findByIdAndDelete(req.params.id);

    if (!deletedArea)
      return res.status(404).json({ error: "Área no encontrada" });

    res.json({ message: "Área eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
