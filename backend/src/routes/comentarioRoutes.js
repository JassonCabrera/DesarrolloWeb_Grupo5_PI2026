const express = require('express');

const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
} = require('../controllers/comentarioController');

const router = express.Router();


// Obtener comentarios de una publicación
router.get('/publicacion/:id_publicacion', obtenerComentarios);


// Crear comentario
router.post('/', crearComentario);


// Eliminar comentario
router.delete('/:id', eliminarComentario);


module.exports = router;