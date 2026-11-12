const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de bienvenida / verificación
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API REST de Usuarios - Node.js + Express + PostgreSQL',
    endpoints: {
      registrar: 'POST /usuarios',
      consultar: 'GET /usuarios',
      consultarPorId: 'GET /usuarios/:id',
      actualizar: 'PUT /usuarios/:id',
      eliminar: 'DELETE /usuarios/:id',
    },
  });
});

// Rutas de la API
app.use('/usuarios', usuariosRoutes);

// Manejo de rutas inexistentes y errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
