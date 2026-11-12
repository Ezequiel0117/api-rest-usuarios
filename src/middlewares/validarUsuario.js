const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO = /^\+?[0-9]{7,15}$/;

// Valida que :id sea un entero positivo
function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo.' });
  }
  req.params.id = id;
  next();
}

// Valida el cuerpo JSON del usuario.
// parcial = true (PUT): solo se validan los campos enviados, pero debe venir al menos uno.
function validarUsuario({ parcial }) {
  return (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'El cuerpo de la petición debe ser un objeto JSON.' });
    }

    const errores = {};
    const { nombre, apellido, email, password, telefono } = body;
    const presente = (v) => v !== undefined;

    if (!parcial || presente(nombre)) {
      if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.trim().length > 50) {
        errores.nombre = 'El nombre es obligatorio y debe tener entre 2 y 50 caracteres.';
      }
    }

    if (!parcial || presente(apellido)) {
      if (typeof apellido !== 'string' || apellido.trim().length < 2 || apellido.trim().length > 50) {
        errores.apellido = 'El apellido es obligatorio y debe tener entre 2 y 50 caracteres.';
      }
    }

    if (!parcial || presente(email)) {
      if (typeof email !== 'string' || !PATRON_EMAIL.test(email.trim())) {
        errores.email = 'El email es obligatorio y debe tener un formato válido.';
      }
    }

    if (!parcial || presente(password)) {
      if (typeof password !== 'string' || password.length < 6) {
        errores.password = 'La contraseña es obligatoria y debe tener al menos 6 caracteres.';
      }
    }

    // El teléfono siempre es opcional (puede ser null para borrarlo)
    if (presente(telefono) && telefono !== null) {
      if (typeof telefono !== 'string' || !PATRON_TELEFONO.test(telefono.trim())) {
        errores.telefono = 'El teléfono debe contener entre 7 y 15 dígitos (puede iniciar con +).';
      }
    }

    if (parcial && ![nombre, apellido, email, password, telefono].some(presente)) {
      return res.status(400).json({
        error: 'Debe enviar al menos un campo para actualizar (nombre, apellido, email, password, telefono).',
      });
    }

    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ error: 'Datos inválidos.', detalles: errores });
    }

    next();
  };
}

module.exports = { validarId, validarUsuario };
