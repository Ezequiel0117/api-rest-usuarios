const { Router } = require('express');
const controller = require('../controllers/usuarios.controller');
const { validarId, validarUsuario } = require('../middlewares/validarUsuario');

const router = Router();

router.post('/', validarUsuario({ parcial: false }), controller.crearUsuario);
router.get('/', controller.obtenerUsuarios);
router.get('/:id', validarId, controller.obtenerUsuarioPorId);
router.put('/:id', validarId, validarUsuario({ parcial: true }), controller.actualizarUsuario);
router.delete('/:id', validarId, controller.eliminarUsuario);

module.exports = router;
