// 404 para rutas que no existen
function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// Manejador central de errores
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido.' });
  }

  // Violación de restricción UNIQUE en PostgreSQL (email duplicado)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Ya existe un usuario registrado con ese email.' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = { notFound, errorHandler };
