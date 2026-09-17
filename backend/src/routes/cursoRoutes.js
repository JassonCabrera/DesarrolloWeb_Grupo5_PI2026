const express = require('express');

const {
    obtenerCursos,
    obtenerCursoPorId,
    buscarCursos,
    crearCurso
} = require('../controllers/cursoController');

const router = express.Router();


// Buscar cursos
router.get('/buscar/:texto', buscarCursos);


// Obtener todos
router.get('/', obtenerCursos);


// Obtener uno
router.get('/:id', obtenerCursoPorId);


// Crear curso
router.post('/', crearCurso);


module.exports = router;