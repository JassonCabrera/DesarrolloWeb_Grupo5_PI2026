const express = require('express');

const {
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    buscarPorRegistro,
    actualizarPerfil,
    cambiarPassword,
    recuperarPassword
} = require('../controllers/usuarioController');

const router = express.Router();


// Registrar usuario
router.post('/registro', registrarUsuario);


// Iniciar sesión
router.post('/login', iniciarSesion);


// Recuperar contraseña
router.post('/recuperar-password', recuperarPassword);


// Obtener todos
router.get('/', obtenerUsuarios);


// Buscar por registro académico
router.get('/buscar/:registro', buscarPorRegistro);


// Obtener por ID
router.get('/:id', obtenerUsuarioPorId);


// Actualizar perfil
router.put('/:id', actualizarPerfil);


// Cambiar contraseña
router.put('/:id/password', cambiarPassword);


module.exports = router;