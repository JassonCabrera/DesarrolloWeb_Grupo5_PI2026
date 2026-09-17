const pool = require('../config/database');


// ==========================================
// OBTENER COMENTARIOS DE UNA PUBLICACIÓN
// ==========================================

const obtenerComentarios = async (req, res) => {

    try {

        const { id_publicacion } = req.params;


        const [comentarios] = await pool.query(
            `
            SELECT
                co.id_comentario,
                co.id_publicacion,
                co.id_usuario,

                CONCAT(
                    u.nombres,
                    ' ',
                    u.apellidos
                ) AS usuario,

                u.registro_academico,

                co.mensaje,
                co.fecha_creacion

            FROM comentarios co

            INNER JOIN usuarios u
                ON co.id_usuario = u.id_usuario

            WHERE co.id_publicacion = ?

            ORDER BY co.fecha_creacion ASC
            `,
            [id_publicacion]
        );


        res.json(comentarios);


    } catch (error) {

        console.error(
            'Error al obtener comentarios:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener comentarios',
            error: error.message
        });

    }
};


// ==========================================
// CREAR COMENTARIO
// ==========================================

const crearComentario = async (req, res) => {

    try {

        const {
            id_publicacion,
            id_usuario,
            mensaje
        } = req.body;


        if (
            !id_publicacion ||
            !id_usuario ||
            !mensaje
        ) {

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });

        }


        const [resultado] = await pool.query(
            `
            INSERT INTO comentarios
            (
                id_publicacion,
                id_usuario,
                mensaje
            )
            VALUES (?, ?, ?)
            `,
            [
                id_publicacion,
                id_usuario,
                mensaje
            ]
        );


        res.status(201).json({

            mensaje: 'Comentario creado correctamente',

            comentario: {
                id_comentario: resultado.insertId,
                id_publicacion,
                id_usuario,
                mensaje
            }

        });


    } catch (error) {

        console.error(
            'Error al crear comentario:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al crear comentario',
            error: error.message
        });

    }
};


// ==========================================
// ELIMINAR COMENTARIO
// ==========================================

const eliminarComentario = async (req, res) => {

    try {

        const { id } = req.params;


        const [resultado] = await pool.query(
            `
            DELETE FROM comentarios
            WHERE id_comentario = ?
            `,
            [id]
        );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: 'Comentario no encontrado'
            });

        }


        res.json({
            mensaje: 'Comentario eliminado correctamente'
        });


    } catch (error) {

        console.error(
            'Error al eliminar comentario:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al eliminar comentario',
            error: error.message
        });

    }
};


module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};