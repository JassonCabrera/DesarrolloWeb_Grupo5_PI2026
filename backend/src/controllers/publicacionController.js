const pool = require('../config/database');


// ==========================================
// OBTENER PUBLICACIONES
// ==========================================

const obtenerPublicaciones = async (req, res) => {

    try {

        const {
            id_curso,
            id_catedratico,
            curso,
            profesor
        } = req.query;


        let sql = `
            SELECT
                p.id_publicacion,
                p.id_usuario,
                CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
                u.registro_academico,

                p.id_curso,
                c.codigo AS codigo_curso,
                c.nombre AS nombre_curso,

                p.id_catedratico,
                CONCAT(cat.nombres, ' ', cat.apellidos) AS catedratico,

                p.mensaje,
                p.fecha_creacion

            FROM publicaciones p

            INNER JOIN usuarios u
                ON p.id_usuario = u.id_usuario

            LEFT JOIN cursos c
                ON p.id_curso = c.id_curso

            LEFT JOIN catedraticos cat
                ON p.id_catedratico = cat.id_catedratico

            WHERE 1 = 1
        `;


        const parametros = [];


        if (id_curso) {

            sql += ` AND p.id_curso = ?`;

            parametros.push(id_curso);

        }


        if (id_catedratico) {

            sql += ` AND p.id_catedratico = ?`;

            parametros.push(id_catedratico);

        }


        if (curso) {

            sql += `
                AND (
                    c.nombre LIKE ?
                    OR c.codigo LIKE ?
                )
            `;

            parametros.push(
                `%${curso}%`,
                `%${curso}%`
            );

        }


        if (profesor) {

            sql += `
                AND (
                    cat.nombres LIKE ?
                    OR cat.apellidos LIKE ?
                )
            `;

            parametros.push(
                `%${profesor}%`,
                `%${profesor}%`
            );

        }


        sql += ` ORDER BY p.fecha_creacion DESC`;


        const [publicaciones] = await pool.query(
            sql,
            parametros
        );


        res.json(publicaciones);


    } catch (error) {

        console.error(
            'Error al obtener publicaciones:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener publicaciones',
            error: error.message
        });

    }
};


// ==========================================
// OBTENER PUBLICACIÓN POR ID
// ==========================================

const obtenerPublicacionPorId = async (req, res) => {

    try {

        const { id } = req.params;


        const [publicaciones] = await pool.query(
            `
            SELECT
                p.id_publicacion,
                p.id_usuario,
                CONCAT(u.nombres, ' ', u.apellidos) AS usuario,

                p.id_curso,
                c.codigo AS codigo_curso,
                c.nombre AS nombre_curso,

                p.id_catedratico,
                CONCAT(cat.nombres, ' ', cat.apellidos) AS catedratico,

                p.mensaje,
                p.fecha_creacion

            FROM publicaciones p

            INNER JOIN usuarios u
                ON p.id_usuario = u.id_usuario

            LEFT JOIN cursos c
                ON p.id_curso = c.id_curso

            LEFT JOIN catedraticos cat
                ON p.id_catedratico = cat.id_catedratico

            WHERE p.id_publicacion = ?
            `,
            [id]
        );


        if (publicaciones.length === 0) {

            return res.status(404).json({
                mensaje: 'Publicación no encontrada'
            });

        }


        res.json(publicaciones[0]);


    } catch (error) {

        console.error(
            'Error al obtener publicación:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener publicación',
            error: error.message
        });

    }
};


// ==========================================
// CREAR PUBLICACIÓN
// ==========================================

const crearPublicacion = async (req, res) => {

    try {

        const {
            id_usuario,
            id_curso,
            id_catedratico,
            mensaje
        } = req.body;


        if (!id_usuario || !mensaje) {

            return res.status(400).json({
                mensaje: 'El usuario y mensaje son obligatorios'
            });

        }


        // Una publicación debe ser sobre un curso
        // o sobre un catedrático, pero no sobre ambos.

        if (!id_curso && !id_catedratico) {

            return res.status(400).json({
                mensaje: 'Debe seleccionar un curso o un catedrático'
            });

        }


        if (id_curso && id_catedratico) {

            return res.status(400).json({
                mensaje: 'Una publicación no puede tener curso y catedrático al mismo tiempo'
            });

        }


        const [resultado] = await pool.query(
            `
            INSERT INTO publicaciones
            (
                id_usuario,
                id_curso,
                id_catedratico,
                mensaje
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                id_usuario,
                id_curso || null,
                id_catedratico || null,
                mensaje
            ]
        );


        res.status(201).json({

            mensaje: 'Publicación creada correctamente',

            publicacion: {
                id_publicacion: resultado.insertId,
                id_usuario,
                id_curso: id_curso || null,
                id_catedratico: id_catedratico || null,
                mensaje
            }

        });


    } catch (error) {

        console.error(
            'Error al crear publicación:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al crear publicación',
            error: error.message
        });

    }
};


// ==========================================
// ELIMINAR PUBLICACIÓN
// ==========================================

const eliminarPublicacion = async (req, res) => {

    try {

        const { id } = req.params;


        const [resultado] = await pool.query(
            `
            DELETE FROM publicaciones
            WHERE id_publicacion = ?
            `,
            [id]
        );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: 'Publicación no encontrada'
            });

        }


        res.json({
            mensaje: 'Publicación eliminada correctamente'
        });


    } catch (error) {

        console.error(
            'Error al eliminar publicación:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al eliminar publicación',
            error: error.message
        });

    }
};


module.exports = {
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    crearPublicacion,
    eliminarPublicacion
};