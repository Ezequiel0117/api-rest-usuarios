const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Columnas que se devuelven al cliente (nunca se expone el password)
const COLUMNAS = 'id, nombre, apellido, email, telefono, creado_en, actualizado_en';

// POST /usuarios -> Registrar
async function crearUsuario(req, res) {
  const { nombre, apellido, email, password, telefono } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, email, password, telefono)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNAS}`,
    [nombre.trim(), apellido.trim(), email.trim().toLowerCase(), passwordHash, telefono?.trim() || null]
  );

  res.status(201).json({ mensaje: 'Usuario registrado correctamente.', usuario: rows[0] });
}

// GET /usuarios -> Consultar todos
async function obtenerUsuarios(req, res) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id`);
  res.status(200).json({ total: rows.length, usuarios: rows });
}

// GET /usuarios/:id -> Consultar por ID
async function obtenerUsuarioPorId(req, res) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`, [req.params.id]);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}.` });
  }
  res.status(200).json(rows[0]);
}

// PUT /usuarios/:id -> Actualizar (solo los campos enviados)
async function actualizarUsuario(req, res) {
  const { nombre, apellido, email, password, telefono } = req.body;
  const campos = [];
  const valores = [];

  const agregar = (columna, valor) => {
    valores.push(valor);
    campos.push(`${columna} = $${valores.length}`);
  };

  if (nombre !== undefined) agregar('nombre', nombre.trim());
  if (apellido !== undefined) agregar('apellido', apellido.trim());
  if (email !== undefined) agregar('email', email.trim().toLowerCase());
  if (password !== undefined) agregar('password', await bcrypt.hash(password, 10));
  if (telefono !== undefined) agregar('telefono', telefono?.trim() || null);

  valores.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET ${campos.join(', ')}, actualizado_en = NOW()
     WHERE id = $${valores.length}
     RETURNING ${COLUMNAS}`,
    valores
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}.` });
  }
  res.status(200).json({ mensaje: 'Usuario actualizado correctamente.', usuario: rows[0] });
}

// DELETE /usuarios/:id -> Eliminar
async function eliminarUsuario(req, res) {
  const { rows } = await pool.query(`DELETE FROM usuarios WHERE id = $1 RETURNING ${COLUMNAS}`, [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}.` });
  }
  res.status(200).json({ mensaje: 'Usuario eliminado correctamente.', usuario: rows[0] });
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
