const express = require('express');

const {
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    crearPublicacion,
    eliminarPublicacion
} = require('../controllers/publicacionController');

const router = express.Router();


// Todas las publicaciones / filtros
router.get('/', obtenerPublicaciones);


// Crear publicación
router.post('/', crearPublicacion);


// Obtener una publicación
router.get('/:id', obtenerPublicacionPorId);


// Eliminar publicación
router.delete('/:id', eliminarPublicacion);


module.exports = router;