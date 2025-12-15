const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  try {
    // Cifrar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const usuario = new Usuario({
      correo: req.body.correo,
      password: hashedPassword,
      rol: req.body.rol
    });

    const nuevoUsuario = await usuario.save();

    // Evitar retornar la contraseña
    nuevoUsuario.password = undefined;

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let datosActualizados = { ...req.body };

    // Si envía una nueva contraseña = cifrarla
    if (req.body.password) {
      datosActualizados.password = await bcrypt.hash(req.body.password, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    ).select("-password");

    if (!usuarioActualizado)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const userResponse = {
      _id: usuario._id,
      correo: usuario.correo,
      rol: usuario.rol
    };

    res.json(userResponse);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
