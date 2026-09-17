const express = require('express');

const {
    obtenerCatedraticos,
    obtenerCatedraticoPorId,
    buscarCatedraticos,
    crearCatedratico
} = require('../controllers/catedraticoController');

const router = express.Router();


// Buscar
router.get('/buscar/:texto', buscarCatedraticos);


// Todos
router.get('/', obtenerCatedraticos);


// Uno
router.get('/:id', obtenerCatedraticoPorId);


// Crear
router.post('/', crearCatedratico);


module.exports = router;