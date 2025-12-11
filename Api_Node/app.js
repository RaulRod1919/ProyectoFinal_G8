const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect('mongodb://root:123456@localhost:27017/BodegaDB?authSource=admin')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err));

// Rutas
const areasRoutes = require('./routes/areas');
const empleadosRoutes = require('./routes/empleados');
const herramientasRoutes = require('./routes/herramientas');
const materialesRoutes = require('./routes/materiales');
const prestamosHerramientaRoutes = require('./routes/prestamos');
const proyectosRoutes = require('./routes/proyectos');
const proveedoresRoutes = require('./routes/proveedores');
const usuariosRoutes = require('./routes/usuarios');
const materialesEmpleadosRoutes = require('./routes/materialesEmpleados');
const materialesProyectosRoutes = require('./routes/materialesProyectos');
const requisicionesRoutes = require('./routes/requisiciones');
const solicitudesMaterialesRoutes = require('./routes/solicitudesMateriales');

// Uso de rutas
app.use('/api/areas', areasRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/herramientas', herramientasRoutes);
app.use('/api/materiales', materialesRoutes);
app.use('/api/prestamos', prestamosHerramientaRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/materialesEmpleados', materialesEmpleadosRoutes);
app.use('/api/materialesProyectos', materialesProyectosRoutes);
app.use('/api/requisiciones', requisicionesRoutes);
app.use('/api/solicitudesMateriales', solicitudesMaterialesRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
