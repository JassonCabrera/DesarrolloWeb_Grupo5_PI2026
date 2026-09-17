const express = require('express');

const {
    obtenerCursosAprobados,
    agregarCursoAprobado,
    eliminarCursoAprobado
} = require('../controllers/cursoAprobadoController');

const router = express.Router();


// Obtener cursos aprobados de un usuario
router.get('/:id_usuario', obtenerCursosAprobados);


// Agregar curso aprobado
router.post('/', agregarCursoAprobado);


// Eliminar curso aprobado
router.delete(
    '/:id_usuario/:id_curso',
    eliminarCursoAprobado
);


module.exports = router;